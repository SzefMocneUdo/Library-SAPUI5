sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("zkzilibraryproject.controller.Books", {
        onInit: function () {
        },

        onNavToDetail: function(oEvent){
            let oRouter = this.getOwnerComponent().getRouter();
            const sPath = oEvent.getSource().getBindingContext().getPath();

            oRouter.navTo("BookDisplay", {
                path: encodeURIComponent(sPath)
            });
        }
    });
});
