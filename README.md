FIDPlus
===
A set of presentational and functional enhancements for footballidentity.

Download Pages
---
FIDPlus for Google Chrome: https://chrome.google.com/webstore/detail/fidplus/hcgfkcipkhjdfobgaahmbeekfkimhbhe

FIDPlus for Mozilla Firefox: https://addons.mozilla.org/en-US/firefox/addon/fidplus

Contributing 
---
1. Fork the repo and clone
2. Create a feature branch and make your changes
3. Commit and push your changes
4. Submit a pull request

Building From Source
---
### Google Chrome
1. Checkout the branch you want to build
2. From Chrome, navigate to Tools -> Extensions
3. Click 'Load unpacked extension' and select the folder containing FIDPlus

To see changes, hit the 'Reload' button underneath the extension information.

### Mozilla Firefox
1. Install the Add-on SDK and activate [(See Documentation)](https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/installation.html)
2. Checkout the branch you want to build
3. From the command shell navigate to the FIDPlus folder then call `cfx run` e.g.

```
cd path\to\folder
cfx run
```

To see changes, close the Firefox window and call `cfx run` again.