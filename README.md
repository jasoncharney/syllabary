# **Syllabary**
## *by* **Jason Charney** *for* **SPLICE Ensemble** (2018)

### Program Notes will go here eventually.
---

### Requirements:
- Three score reading revices (tablets or laptops at stations)
- A computer running the Max patch and Node Express server (can be one of the score readers).
- A stable WiFi network (prefereably an adhoc or local wireless router to decrease latency)

![Signal routing](https://raw.githubusercontent.com/jasoncharney/syllabary/master/readme-imgs/signaldiagram.png)

---
### Installation: 

Download this repository as a zip file. Unzip and move the whole folder to the desired directory, but leave the unzipped folder organized as it is.

[Download and install node.js](https://nodejs.org/en/download/) on the computer that will be serving the score.

---

### Initial setup:

***Find IP address and update ports file*** 

You only have to do this once if you have a static IP or aren't changing WiFi networks. If the computer running the Syllabary server remains connected to the same network it should remain stable. But, it doesn't hurt to check each time. 

Open Terminal and run `ifconfig` . Find the IP address of the computer on the current WiFi network (probably labeled with `en0` in front of it).

![ifconfig](https://raw.githubusercontent.com/jasoncharney/syllabary/master/readme-imgs/ifconfig.png)

Change the `hostIP` entry in [ports.json]() and save .

![ports](https://raw.githubusercontent.com/jasoncharney/syllabary/master/readme-imgs/ports.png)

Open [Syllabary-Max.maxproj]() project in Max. Only `Syllabary.maxpat` should open.

***On first open:** Drag and drop the `ports.JSON` file from [/Syllabary-JS/](/Syllabary-JS/) into the area in `[Syllabary-Max.maxpat](). Refresh the project and make sure there are no errors thrown in the Max window.*

---

### Before each performance

**Run the server on the host computer:**

In Terminal, `cd` to  [/Syllabary-JS/](/Syllabary-JS/). Enter:
 
    node SyllabaryServer.js

If the server is running and ready, the patch should show the server status as "ON".

**On each reader device:**
1. Make sure you're on the same WiFi network as the server.
2. Open a browser window with the device in landscape orientation. Navigate to the address formatted like this (hostIP and expressPort taken from `ports.json`:

        hostIP:expressPort

![readerinit](https://raw.githubusercontent.com/jasoncharney/syllabary/master/readme-imgs/ipadinit.jpeg)

You should see a black screen and three buttons with your names on them. Press your name to link your device. The piece cannot begin unless three unique readers are connected (view connection status in patch). The START button will appear when all three users are connected.

---

### INITIAL TESTS 