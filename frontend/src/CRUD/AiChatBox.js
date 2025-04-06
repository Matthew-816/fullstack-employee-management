import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const AiChatBox = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Store chat entries
  const [stompClient, setStompClient] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lastQueryRef = useRef(""); // Track the last sent query

  const fromPath = location.state?.from || "";
  const fromAdmin = fromPath === "/AdminCrud";
  const fromUser = fromPath === "/UserCrud";

  useEffect(() => {
    const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: (frame) => {
        console.log("Connected:", frame);
        client.subscribe("/topic/employee-search", (message) => {
          const data = JSON.parse(message.body);
          console.log("Received:", data);
          setIsLoading(false);

          setChatHistory((prev) => {
            const updatedHistory = [...prev];
            const lastEntry = updatedHistory[updatedHistory.length - 1];

            if (data[0]?.firstName.startsWith("Error:")) {
              lastEntry.error = data[0].firstName.replace("Error: ", "");
            } else if (data.length === 0) {
              lastEntry.noResults = true;
            } else {
              lastEntry.employees = data;
            }
            lastEntry.responseTimestamp = new Date().toLocaleTimeString();

            return updatedHistory;
          });
          setError(""); // Clear any global error
        });
        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"], frame.body);
        setError("Connection error. Please try again.");
      },
      onWebSocketError: (error) => {
        console.error("WebSocket Error:", error);
        setError("WebSocket error. Check if the backend is running.");
      },
      onWebSocketClose: (event) => {
        console.log("WebSocket Closed:", event);
        setStompClient(null);
      },
    });

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
        console.log("Disconnected");
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!stompClient || !stompClient.connected) {
      setError("Not connected to the server. Please wait or refresh.");
      return;
    }
    if (message.trim()) {
      setIsLoading(true);
      const queryEntry = {
        query: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      lastQueryRef.current = message; // Store the query before sending
      setChatHistory((prev) => [...prev, queryEntry]); // Add query only once
      stompClient.publish({
        destination: "/app/search-employees",
        body: JSON.stringify({ description: message }),
      });
      setMessage("");
    }
  };

  const handleBack = () => {
    // Clear chat history when navigating back
    setChatHistory([]);
    navigate(fromPath || "/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">AI Employee Chatroom</h2>

      <div className="w-full max-w-md mb-4">
        <p
          className={
            stompClient?.connected ? "text-green-500" : "text-yellow-500"
          }
        >
          {stompClient?.connected ? "Connected" : "Connecting to server..."}
        </p>
      </div>
      <div className="w-full max-w-md h-96 bg-white shadow-md rounded px-4 pt-4 pb-4 mb-4 overflow-y-auto">
        {chatHistory.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center">
            Start by searching for employees!
          </p>
        )}
        {chatHistory.map((entry, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-end">
              <div className="bg-blue-100 text-blue-800 p-2 rounded-lg max-w-xs">
                <p className="font-bold">You ({entry.timestamp}):</p>
                <p>{entry.query}</p>
              </div>
            </div>
            {entry.employees && (
              <div className="flex justify-start">
                <div className="bg-green-100 text-green-800 p-2 rounded-lg max-w-xs">
                  <p className="font-bold">
                    AI ({entry.responseTimestamp || entry.timestamp}):
                  </p>
                  <ul className="list-disc pl-5">
                    {entry.employees.map((employee, empIndex) => (
                      <li key={empIndex}>
                        {employee.firstName} {employee.lastName || ""} (ID:{" "}
                        {employee.empNo || "N/A"})
                        <br />
                        Dept: {employee.deptName || "N/A"}, Title:{" "}
                        {employee.title || "N/A"}
                        <br />
                        Salary: ${employee.salary || "N/A"}, Email:{" "}
                        {employee.email || "N/A"}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {entry.error && (
              <div className="flex justify-start">
                <div className="bg-red-100 text-red-700 p-2 rounded-lg max-w-xs">
                  <p className="font-bold">
                    AI ({entry.responseTimestamp || entry.timestamp}):
                  </p>
                  <p>Error: {entry.error}</p>
                </div>
              </div>
            )}
            {entry.noResults && (
              <div className="flex justify-start">
                <div className="bg-yellow-100 text-yellow-700 p-2 rounded-lg max-w-xs">
                  <p className="font-bold">
                    AI ({entry.responseTimestamp || entry.timestamp}):
                  </p>
                  <p>No employees found matching your description.</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-700 p-2 rounded-lg max-w-xs">
              <p className="font-bold">AI:</p>
              <p>Searching...</p>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="message"
          >
            Who do you want to find?
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
            placeholder="e.g., Find employees named Emma"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            type="submit"
            disabled={!stompClient || !stompClient.connected || !message.trim()}
          >
            Search
          </button>
        </div>
      </form>
      {error && (
        <div className="w-full max-w-md mb-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
              className="text-sm text-red-500 hover:text-red-700 mt-2"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <div className="w-full max-w-md flex justify-between">
        {fromUser && (
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back To User Dashboard
          </button>
        )}
        {fromAdmin && (
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back To Admin Dashboard
          </button>
        )}
        {!fromUser && !fromAdmin && (
          <button
            onClick={handleBack}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back To Home
          </button>
        )}
      </div>
    </div>
  );
};

export default AiChatBox;
