sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
  ],

  function (Controller, History) {
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
        let errorMessage = "An unknown error occurred";

        if (oError && oError.responseText) {
            try {
                const errorObj = JSON.parse(oError.responseText);

                if (errorObj && errorObj.error && errorObj.error.message && errorObj.error.message.value) {
                    errorMessage = errorObj.error.message.value;
                }
            } catch (e) {
                console.error("Failed to parse error response as JSON", e);
            }
        }
    
        return errorMessage;
    }
    
    });
  }
);
