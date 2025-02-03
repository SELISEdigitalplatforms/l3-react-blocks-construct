# SELISE `<blocks />` Construct

SELISE `<blocks/>` Construct is a fully functional application blueprint designed to accelerate development with **SELISE `<blocks />`**. Pre-integrated with SELISE `<blocks />` microservices, it offers a seamless full-stack foundation, complete with essential features, prebuilt modules, and practical use cases. Whether starting fresh or enhancing an existing project, **SELISE Blocks Construct** provides a scalable framework that streamlines workflows, ensures best practices, and maximizes **SELISE `<blocks />`'** capabilities.


### 🌍 Live Links  

*SELISE `<blocks />` Construct* - https://dev-construct.seliseblocks.com 

*SELISE `<blocks />` Cloud App* - https://dev-app.seliseblocks.com

### 🔗 Other Links  

**Frontend**

SELISE `<blocks />` cli npm package - https://www.npmjs.com/package/@seliseblocks/cli

Open-source GitHub repo link - https://github.com/SELISEdigitalplatforms/l3-react-blocks-construct

**Backend**

SELISE `<blocks />` cli nuget package - https://www.nuget.org/packages/SeliseBlocks.CLI

Open-source GitHub repo link - https://github.com/SELISEdigitalplatforms/l3-net-blocks-consumer

---








## 📌 Setting Up Blocks Construct Using CLI


### Step 1: Access SELISE `<blocks />` Cloud App's Console

#### Visit SELISE `<blocks />` Cloud App

- Open your browser and navigate to [SELISE `<blocks />` Cloud App](https://dev-app.seliseblocks.com/).

#### Sign Up for an Account

- Click on the **Sign Up** button to create a new account.

#### Log In to Your Account

- Once signed up, log in with your credentials and proceed to the **Console** section.

---

### Step 2: Create a New Project

#### Start a New Project

- In the **Console**, click on **Create New Project**.

#### Project Name (Step 1)

- Enter a **unique name** for your project.

#### Domain (Step 2)

- Provide the **domain** associated with your project.

#### Access Your Project Dashboard

- After creating your project, navigate to the **Project Dashboard**.

---

### Step 3: Install SELISE Blocks CLI

#### Install SELISE Blocks CLI Globally

**Prerequisites:** Make sure you have NVM and Node.js (version 20.x or later) installed on your machine before proceeding with the installation. 

Detailed installation steps - [How to Install Node on a MacOS, Linux, or Windows Machine Using NVM](https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/)

```sh
npm install -g @seliseblocks/cli
```
**Note:** In case you are facing any permission-related issues on your Linux/MacOS, use `sudo` before the command.

#### Verify the Installation (Optional)

```sh
blocks v
# or
blocks version
```

If you receive a version number, the installation is successful. If no response appears, re-run the previous command.

<img width="395" alt="Screenshot 2025-01-31 at 9 25 22 PM" src="https://github.com/user-attachments/assets/10b30647-229f-478f-b26e-87bb04be3490" />


---

### Step 4: Set Up Your Project

#### Create a New Project Locally

```sh
blocks new <project-name>
```

Replace `<project-name>` with your project’s name.

#### Enter Your Domain

- When prompted, enter the domain you provided earlier.

#### Enter the Project Key

- Find your **Project Key** on your **Project Dashboard** and enter it when prompted.
- The GitHub repository for **SELISE Blocks Construct** will now be cloned and installed on your local machine.

#### Choose your preferred environment

- You can select either the Development(dev) or Stage(stg) environment to start your project.

*Note: The Development(dev) environment is for building and testing, while the Stage(stg) environment is for final testing before going live.*

#### Navigate to the Project Directory

```sh
cd <project-name>
```

Replace `<project-name>` with your actual project’s name.

---

### Step 5: Start SELISE Blocks Construct

#### Launch the Application

To run the project using your application domain, you will need to add an entry for your application domain in the hosts file of your machine. Then, use:

```sh
npm run start:local
```
How to give entry in the hostfile? [Please read this](https://www.manageengine.com/network-monitoring/how-to/how-to-add-static-entry.html)

Or 

To run the project using localhost, use:

```sh
npm start
```

- The **login page** for your project should now appear.

---

### Step 6: Create and Log In

#### Create a User on SELISE `<blocks />` Cloud App

- If you haven't already, invite a user from User Management Service on the [**SELISE `<blocks />` Cloud App**](https://dev-app.seliseblocks.com/) application.

![Screenshot 2025-01-29 at 11 30 28 AM](https://github.com/user-attachments/assets/96185c96-a2e3-4502-8124-29a18f0ad30b)

An activation email will be sent to the user's email for your project portal. Upon clicking it, the user will be able to set a password for the portal, and their account will be activated.

#### Log In to SELISE Blocks Construct

- Use your new credentials to log in to [**SELISE Blocks Construct**](https://dev-construct.seliseblocks.com).




## 🎯 You're all set!

Now, you can start building and customizing your application using **SELISE Blocks Construct**. 🚀

