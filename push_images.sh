# Function to display usage message
usage() {
    echo "Usage: $0 -e <env-file>"
    echo "  -e <env-file>    Specify the environment file (mandatory)"
    exit 1
}

# Parse options
while getopts "e:" option; do
    case $option in
        e) ENV_FILE=$OPTARG ;;
        *) usage ;;
    esac
done

# Check if the env file was provided
if [ -z "$ENV_FILE" ]; then
    echo "Error: Environment file is required."
    usage
fi

# Load environment variables from the file
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE..."
    # Filter comments, empty lines, and clean up potential issues
    eval "$(grep -v '^#' "$ENV_FILE" | grep -v '^[[:space:]]*$' | sed 's/\r$//')" || {
        echo "Error: Failed to source $ENV_FILE"
        exit 1
    }
    # Debug output to verify variables
    echo "DEBUG: AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID"
    echo "DEBUG: AWS_REGION=$AWS_REGION"
    echo "DEBUG: FRONTEND_IMAGE_NAME=$FRONTEND_IMAGE_NAME"
    echo "DEBUG: BACKEND_IMAGE_NAME=$BACKEND_IMAGE_NAME"
else
    echo "Error: Environment file '$ENV_FILE' not found."
    exit 1
fi

# Validate essential environment variables
REQUIRED_VARS=(
    "AWS_ACCOUNT_ID"
    "AWS_REGION"
    "FRONTEND_IMAGE_NAME"
    "BACKEND_IMAGE_NAME"
)
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set in the environment file."
        exit 1
    fi
done

# Construct ECR base URL
AWS_ECR_BASE_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Log in to AWS ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ECR_BASE_URL" || {
    echo "Error: Failed to log in to AWS ECR"
    exit 1
}

# Push images to ECR
echo "Pushing frontend image ${FRONTEND_IMAGE_NAME} to ECR..."
docker push "$FRONTEND_IMAGE_NAME" || {
    echo "Error: Failed to push frontend image"
    exit 1
}

echo "Pushing backend image ${BACKEND_IMAGE_NAME} to ECR..."
docker push "$BACKEND_IMAGE_NAME" || {
    echo "Error: Failed to push backend image"
    exit 1
}

echo "Docker images pushed to AWS ECR successfully."