sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
  ],

  function (Controller, History, JSON) {
    "use strict";
    return Controller.extend("zkzilibraryproject.controller.Base", {
      aFragments: {},
      onInit: function () {},

      onNavBack: function () {
        let oHistory = History.getInstance(),
          sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          let oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Books", {}.true);
        }
      },

      getErrorMessage: function (oError) {
        return JSON.parse(oError.responseText).error.message.value;
      },

//       initMessage: function (errDetails) {
//         // var oLink = new Link({
//         // text: "Show more information",
//         // href: "http://sap.com",
//         // target: "_blank"
//         // });
//         var a = this.getText("year");
//         var oMessageTemplate = new MessageItem({
//           type: "{type}",
//           title: "{title}",
//           description: "{description}",
//           subtitle: "{subtitle}",
//           counter: "{counter}",
//           markupDescription: "{markupDescription}",
//           // link: oLink
//         });
//         var aMockMessages = [];
//         for (var i = 0; i < errDetails.length; i++) {
//           var name = errDetails[i].severity;
//           var nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
//           var semiDescription = errDetails[i].message.slice(0, 10);
//           semiDescription = semiDescription.concat("...");
//           var oMockMessage = {
//             type: nameCapitalized,
//             title: semiDescription,
//             description: errDetails[i].message,
//           };
//           aMockMessages.push(oMockMessage);
//         }
//         var oModel = new JSONModel();
//         oModel.setData(aMockMessages);
//         var that = this;
//         var oBackButton = new Button({
//           icon: sap.ui.core.IconPool.getIconURI("navback"),
//           visible: false,
//           press: function () {
//             that.oMessageView.navigateBack();
//             this.setVisible(false);
//           },
//         });
//         this.oMessageView = new MessageView({
//           showDetailsPageHeader: false,
//           itemSelect: function () {
//             oBackButton.setVisible(true);
//           },
//           items: {
//             path: "/",
//             template: oMessageTemplate,
//           },
//         });
//         this.oMessageView.setModel(oModel);
//         this.oDialog = new Dialog({
//           resizable: true,
//           content: this.oMessageView,
//           state: "Error",
//           beginButton: new Button({
//             press: function () {
//               this.getParent().close();
//             },
//             text: "Close",
//           }),
//           customHeader: new Bar({
//             contentMiddle: [
//               new Text({
//                 text: "Error",
//               }),
//             ],
//             contentLeft: [oBackButton],
//           }),
//           contentHeight: "300px",
//           contentWidth: "500px",
//           verticalScrolling: false,
//         });
//       },

//       manageErrors: function (errDetails) {
//         this.initMessage(errDetails);
//         this.oMessageView.navigateBack();
//         this.oDialog.open();
//       }
    });
  }
);
