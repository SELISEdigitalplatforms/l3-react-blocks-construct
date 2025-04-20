# SELISE `<blocks />` Constructᵇᵉᵗᵃ

SELISE `<blocks/>` Construct is a fully functional application blueprint designed to accelerate development with **SELISE `<blocks />`**. Pre-integrated with SELISE `<blocks />` microservices, it offers a seamless full-stack foundation, complete with essential features, prebuilt modules, and practical use cases. Whether starting fresh or enhancing an existing project, **SELISE Blocks Construct** provides a scalable framework that streamlines workflows, ensures best practices, and maximizes **SELISE `<blocks />`'** capabilities.

## Live Links

- **SELISE `<blocks />` Construct** → [construct.seliseblocks.com](https://construct.seliseblocks.com)
- **SELISE `<blocks />` Cloud App** → [cloud.seliseblocks.com](https://cloud.seliseblocks.com)

## Other Links

### Frontend

- **SELISE `<blocks />` CLI (NPM)** → [@seliseblocks/cli](https://www.npmjs.com/package/@seliseblocks/cli)
- **GitHub Repository** → [l3-react-blocks-construct](https://github.com/SELISEdigitalplatforms/l3-react-blocks-construct)

### Backend

- **SELISE `<blocks />` CLI (NuGet)** → [SeliseBlocks.CLI](https://www.nuget.org/packages/SeliseBlocks.CLI)
- **GitHub Repository** → [l3-net-blocks-consumer](https://github.com/SELISEdigitalplatforms/l3-net-blocks-consumer)

---

## Setting Up Blocks Construct Using CLI

<details>
  <summary><strong>1. Access SELISE Blocks Cloud </strong></summary>

### Open the Cloud App
1. In your browser, go to [SELISE `<blocks />` Cloud App](https://cloud.seliseblocks.com).

### Create an Account
1. Click **Sign Up** and follow the instructions to create an account.
2. Once registered, log in with your credentials.

### Access the Console
1. After logging in, you will land on the **Console** where you can manage projects.

</details>

---

<details>
  <summary><strong>2. Create a New Project</strong></summary>

### Before You Begin
Ensure that you:
- Have a registered web domain for your application.
- Have full administrative access to its DNS settings.

### Create Your Project
1. In the **Console**, click **Create New Project**.
2. Enter a **unique project name**.
3. Select an **environment**:
   - Choose either **Sandbox** or **Production**.
   - The page will expand to display the **domain input field**.
4. (Optional) Enable **Cookie Domain**:
   - Check the box to see the **cookie domain in use**.
   - Follow the provided instructions for DNS settings.
5. Click **Create** to initialize the project.
6. The Console will update to display your project.

</details>

---

<details>
  <summary><strong>3. Install SELISE Blocks CLI</strong></summary>

### Check System Requirements
Ensure your system has the following installed:

- **Node.js (v20.x or later)** → [Download Node.js](https://nodejs.org/en/download)
- **NVM (Node Version Manager)** → [Install NVM](https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/)
- **Git** → [Download Git](https://git-scm.com/downloads)

### Install SELISE Blocks CLI
Run the following command in your terminal:
```sh
npm install -g @seliseblocks/cli
```
If you encounter permission issues on Linux/macOS, use:
```sh
sudo npm install -g @seliseblocks/cli
```

### Verify Installation
To confirm installation, run:
```sh
blocks
```
To check the installed version:
```sh
blocks v
```

</details>

---

<details>
  <summary><strong>4. Create a New Project Locally</strong></summary>

### Initialize the Project
1. Open a terminal.
2. Run the following command:
   ```sh
   blocks new <project-name>
   ```
   - Replace `<project-name>` with your desired folder name. The repository will be cloned into this folder.

### Enter Project Details
1. When prompted, enter the **domain** you registered earlier.
2. Retrieve the **Project Key** from the **Project Dashboard**.
3. Copy and paste the Project Key into the terminal when prompted.
4. Configure cookies:
   - You will be asked whether to enable or disable cookies.
   - Use the **arrow keys** (Up/Down) to select your preference and press **Enter**.
5. The repository will be downloaded with your project configured.

</details>

---

<details>
  <summary><strong>5. Start SELISE Blocks Construct</strong></summary>

### Navigate to the Project Directory
1. In your terminal, navigate to the project folder:
   ```sh
   cd <project-name>
   ```
   Replace `<project-name>` with the actual project name.

### Start the Application Locally
Run the following command to start the project:
```sh
npm start
```

### Run Using Your Application Domain
1. Add an entry for your domain in the **hosts file** of your machine. Follow [this guide](https://www.manageengine.com/network-monitoring/how-to/how-to-add-static-entry.html) for instructions.
2. Register your site on **Google reCAPTCHA** by visiting [this page](https://www.google.com/recaptcha/admin/create).
3. Update the `siteKey` value in your project wherever reCAPTCHA is integrated.

Then, run:
```sh
npm run start:local
```

The **login page** should now be accessible.

</details>

---

<details>
  <summary><strong>6. Create and Log In</strong></summary>

### Create a User
1. In the **User Management Service** on [SELISE `<blocks />` Cloud App](https://cloud.seliseblocks.com/), invite a new user.
2. The user will receive an activation email.
3. They must click the activation link and set a password.

### Log In to SELISE Blocks Construct
- Go to your application's domain (the one you entered earlier) or use `localhost` if running locally, and log in using the newly created credentials.

</details>

---

## Next Steps
You are now ready to start building and customizing your application with **SELISE Blocks Construct**.
