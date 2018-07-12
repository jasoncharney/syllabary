# **Syllabary**
## *by* **Jason Charney** *for* **SPLICE Ensemble** (2018)

### Program Notes will go here eventually.
---

### Requirements:
- Three score reading revices (tablets or laptops at stations)
- A computer running the Max patch and Node Express server (can be one of the score readers).
- A stable WiFi network (prefereably a local one to decrease latency)

    [signal diagram]
---
### Installation:

Download this repository as a zip file. Unzip and move the whole folder to the desired directory, but leave the unzipped folder organized as it is.

[Download and install node.js](https://nodejs.org/en/download/) on the computer that will be serving the score.

---

### Initial setup:

***Update host IP:*** 

You only need to do this each time the network changes. Sometimes dynamic IP addresses will be assigned, but the address should be stable as long as the server device remains connected (you can check with the `ifconfig` command). You can skip this if you have a static IP or aren't reconfiguring the network.

Open Terminal and run `ifconfig` . Find the IP address of the computer on the current WiFi network (probably labeled with `en0` in front of it).

![ifconfig](https://raw.githubusercontent.com/jasoncharney/syllabary/master/readme-imgs/ifconfig.png)

Change the `hostIP` entry in `ports.JSON` (be sure to keep the quotes around it) and save. You can also change the ports here if they are being used by other applications.

[img here]

Open `Syllabary-Max.maxproj` project in Max. Only `Syllabary.maxpat` should open.

***On first open or if you move the project directory:** Drag and drop the `ports.JSON` file into the filedrop area in `Syllabary.maxpat` so it can reference the correct filepath. Refresh the project and make sure there's no errors thrown in the Max window.*

---

### Before each performance

**Run the server on the host computer:**

In terminal, `cd` to the folder where `SyllabaryServer.js` is located. Enter:
 
    node SyllabaryServer.js

If the server is running and ready, the patch should show the server status as "ON".

[image]

**On each device:**
1. Make sure you're on the same WiFi network as the server.
2. Open a browser window with the device in landscape orientation. Navigate to the address formatted like this (hostIP and expressPort taken from `ports.json`:

        hostIP:expressPort

[image]

You should see a black screen and three buttons with your names on them. Press your name to link your device. The piece cannot begin unless three unique readers are connected.

---

### INITIAL TESTS 