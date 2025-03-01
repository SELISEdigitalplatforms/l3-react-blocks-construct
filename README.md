# SELISE `<blocks />` Constructᵇᵉᵗᵃ

SELISE `<blocks/>` Construct is a fully functional application blueprint designed to accelerate development with **SELISE `<blocks />`**. Pre-integrated with SELISE `<blocks />` microservices, it offers a seamless full-stack foundation, complete with essential features, prebuilt modules, and practical use cases. Whether starting fresh or enhancing an existing project, **SELISE Blocks Construct** provides a scalable framework that streamlines workflows, ensures best practices, and maximizes **SELISE `<blocks />`'** capabilities.


### 🌍 Live Links  

*SELISE `<blocks />` Construct* - https://construct.seliseblocks.com

*SELISE `<blocks />` Cloud App* - https://cloud.seliseblocks.com

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

- Open your browser and navigate to [SELISE `<blocks />` Cloud App](https://cloud.seliseblocks.com).

#### Sign Up for an Account

- Click on the **Sign Up** button to create a new account.

#### Log In to Your Account

- Once signed up, log in with your credentials and proceed to the **Console** section.

---

### Step 2: Create a New Project

**Prerequisites:** Prerequisites: Ensure that you have a registered web domain for your application and full administrative access to its DNS settings.

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

**Detailed installation steps** -

For installing nodejs directly follow the instructions of this [link](https://nodejs.org/en/download)

Or,

To install via NVM follow this [link](https://www.freecodecamp.org/news/how-to-install-node-in-your-machines-macos-linux-windows/)

```sh
npm install -g @seliseblocks/cli
```
**Note:** In case you are facing any permission-related issues on your Linux/MacOS, use `sudo` before the command.

#### Verify the Installation (Optional)

![image (1)](https://github.com/user-attachments/assets/cc045c8b-01e8-431c-b958-253793baf562)

i) Upon running the following command if you can see the above image, your installation is successful.

```sh
blocks 

```


ii) Run the following command to check blocks version -

```sh
blocks v
```

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


#### Navigate to the Project Directory

```sh
cd <project-name>
```

Replace `<project-name>` with your actual project’s name.

---

### Step 5: Start SELISE Blocks Construct

#### Launch the Application

To run the project using localhost, use:

```sh
npm start
```

Or, 

To run the project using your application domain - 

i) You will need to add an entry for your application domain in the hosts file of your machine. How to give entry in the hostfile? [Please read this](https://www.manageengine.com/network-monitoring/how-to/how-to-add-static-entry.html)

ii) Register your site on Google reCAPTCHA  [here](https://www.google.com/recaptcha/admin/create)
 and update the siteKey property of the components where reCAPTCHA has been integrated accordingly in the construct project.


Then, use:

```sh
npm run start:local
```

- The **login page** for your project should now appear.

---

### Step 6: Create and Log In

#### Create a User on SELISE `<blocks />` Cloud App

- If you haven't already, invite a user from User Management Service on the [**SELISE `<blocks />` Cloud App**](https://cloud.seliseblocks.com/) application.

![Screenshot 2025-01-29 at 11 30 28 AM](https://github.com/user-attachments/assets/96185c96-a2e3-4502-8124-29a18f0ad30b)

An activation email will be sent to the user's email for your project portal. Upon clicking it, the user will be able to set a password for the portal, and their account will be activated.

#### Log In to SELISE Blocks Construct

- Use your new credentials to log in to [**SELISE Blocks Construct**](https://construct.seliseblocks.com).




## 🎯 You're all set!

Now, you can start building and customizing your application using **SELISE Blocks Construct**. 🚀
