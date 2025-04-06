-- Drop the table if it already exists (optional)
DROP TABLE IF EXISTS app_user;


-- Create the user table for AppUser entity
CREATE TABLE if not exists app_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    hashed_Password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE if not exists employees_crud (
    emp_no BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    title VARCHAR(50),
    birth_date DATE,
    gender CHAR(1),
    dept_no CHAR(4),
    dept_name VARCHAR(40),
    salary DECIMAL(10, 2),
    hire_date DATE,
    from_date DATE,
    to_date DATE,
    email VARCHAR(255) UNIQUE NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

