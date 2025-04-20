# Deploying a React App to Azure Static Web Apps Manually

## Prerequisites

*   An Azure subscription. If you don't have one, you can [create a free Azure account](https://azure.microsoft.com/en-us/free/).
*   A React application built for production (using `npm run build` or `yarn build`).
*   Node.js and npm (or yarn) installed. You can download Node.js from [nodejs.org](https://nodejs.org/).

## Steps

1. **Create a Static Web App in Azure:**

    *   Navigate to the Azure portal ([https://portal.azure.com](https://portal.azure.com)).
    *   Search for "Static Web Apps" in the search bar and select it.
    *   Click "Create" to create a new Static Web App. You'll need to provide details like the subscription, resource group, and name for your app. *Important:* You do *not* need to connect a repository at this stage if you are deploying manually.

2. **Create `swa-cli.config.json`:**

    *   Create a file named `swa-cli.config.json` in the root directory of your React project (alongside `package.json`).
    *   Paste the following configuration into the file, replacing `<static-app name>` with the *exact* name of your Static Web App in Azure:

    ```json
    {
      "$schema": "https://aka.ms/azure/static-web-apps-cli/schema",
      "configurations": {
        "<static-app name>": {
          "appDir": "build",
          "outputLocation": "build"
        }
      }
    }
    ```

    *   **Explanation:**
        *   `$schema`: Points to the schema for validation.
        *   `configurations`: Contains the configuration for your static web app.
        *   `<static-app name>`: The *name* of your static web app in Azure. **This must match exactly.**
        *   `appDir`: Specifies the directory containing your built application files (usually `build` after running `npm run build`).
        *   `outputLocation`: Should match the `appDir` in this case. This is where the built files will be located.

3. **Create `staticwebapp.config.json`:**

    *   Create a file named `staticwebapp.config.json` in the root directory of your React project (alongside `package.json` and `swa-cli.config.json`).
    *   Paste the following configuration into the file:

    ```json
    {
        "navigationFallback": {
            "rewrite": "/index.html"
        }
    }
    ```

    *   **Explanation:**
        *   `navigationFallback`: Tells Azure Static Web Apps to serve `index.html` for requests that don't match static files (CSS, JavaScript, images). This is how client-side routing works.

4. **Install the Azure Static Web Apps CLI:**

    *   Open your terminal in the root directory of your React project.
    *   Run the following command to install the CLI globally:

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

5. **Verify Installation:**

    *   Run the following command to check the CLI version:

    ```bash
    swa --version
    ```

6. **Get the Deployment Token:**

    *   In the Azure portal, navigate to your Static Web App.
    *   In the left-hand menu, under "Settings," find "Deployment credentials."
    *   Copy the "Manage deployment token" value. **Keep this token secure!** Treat it like a password.

7. **Deploy the Application:**

    *   In your terminal, navigate to the root directory of your React project.
    *   Run the following command, replacing `<token>` with the deployment token you copied and `<static-app name>` with the name of your static web app in Azure:

    ```bash
    swa deploy --deployment-token "<token>" --config-name "<static-app name>" --env production
    ```

    *   If you do not set `--env` it will deploy in preview mode.

8. **Access Your Application:**

    *   Once the deployment is complete, the CLI will output the URL of your deployed application. You can also find this URL in the Azure portal on the overview page of your Static Web App.

---

## Troubleshooting

* **`swa` command not found:** Ensure Node.js and npm (or yarn) are installed correctly, and that you installed the `@azure/static-web-apps-cli` globally.
* **Deployment errors:** Double-check the `<static-app name>` in your `swa-cli.config.json` file and the `swa deploy` command. Verify the deployment token is correct. Examine the output in the terminal for specific error messages.

---

### Deployment Script for Manual Deployment

You can also use the following deployment script to automate the process:

```bash
#!/bin/bash
 
# Function to check if a command exists
dependencies=("node" "npm" "swa")
check_dependency() {
    if ! command -v "$1" &>/dev/null; then
        echo "Error: $1 is not installed. Please install it before running this script."
        exit 1
    fi
}
 
# Check dependencies
for dep in "${dependencies[@]}"; do
    check_dependency "$dep"
done
 
# Ensure Azure Static Web Apps CLI is installed
if ! npm list -g @azure/static-web-apps-cli &>/dev/null; then
    echo "Installing Azure Static Web Apps CLI..."
    npm install -g @azure/static-web-apps-cli
fi
 
# Get user input for Static Web App details
echo "Enter your Azure Static Web App name:"
read STATIC_APP_NAME
 
if [ -z "$STATIC_APP_NAME" ]; then
    echo "Error: Static Web App name cannot be empty."
    exit 1
fi
 
# Get the deployment token
echo "Enter your Azure Static Web App deployment token (paste and press Enter):"
read DEPLOYMENT_TOKEN
 
if [ -z "$DEPLOYMENT_TOKEN" ]; then
    echo "Error: Deployment token cannot be empty."
    exit 1
fi
 
# Build the React app
echo "Building the React application..."
npm install && npm run build
 
if [ $? -ne 0 ]; then
    echo "Error: React app build failed. Check the logs above."
    exit 1
fi
 
# Check and create swa-cli.config.json if it doesn't exist
if [ ! -f swa-cli.config.json ]; then
    cat > swa-cli.config.json <<EOL
{
  "$schema": "https://aka.ms/azure/static-web-apps-cli/schema",
  "configurations": {
    "$STATIC_APP_NAME": {
      "appDir": "build",
      "outputLocation": "build"
    }
  }
}
EOL
    echo "swa-cli.config.json created successfully."
else
    echo "swa-cli.config.json already exists. Skipping creation."
fi
 
# Check and create staticwebapp.config.json if it doesn't exist
if [ ! -f staticwebapp.config.json ]; then
    cat > staticwebapp.config.json <<EOL
{
    "navigationFallback": {
        "rewrite": "/index.html"
    }
}
EOL
    echo "staticwebapp.config.json created successfully."
else
    echo "staticwebapp.config.json already exists. Skipping creation."
fi
 
# Deploy the application
echo "Deploying to Azure Static Web Apps..."
swa deploy --deployment-token "$DEPLOYMENT_TOKEN" --config-name "$STATIC_APP_NAME" --env production
 
if [ $? -eq 0 ]; then
    echo "Deployment successful!"
else
    echo "Deployment failed. Check the error messages above."
    exit 1
fi
```

### Run Script for Manual Deployment

This script will:
1. Verify dependencies are installed.
2. Build your React app.
3. Check for existing configuration files or create them.
4. Deploy the app to Azure Static Web Apps using your deployment token.

To run the script using `npm run build-and-deploy`, you can add the following `"build-and-deploy"` script to your `package.json`:

```json
{
  "scripts": {
    ....
    ....
    "build-and-deploy": "bash deploy.sh",
    ....
    ....
  }
}
```

This way, when you run:

```bash
npm run build-and-deploy
```

It will first execute the `build` script (which builds your React app) and then run the `deploy.sh` script to deploy your app to Azure Static Web Apps. Make sure the `deploy.sh` script is in the root directory of your project.

