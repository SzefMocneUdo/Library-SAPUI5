sap.ui.define([
    "zkzilibraryproject/controller/Base.controller"
],

    function (Base){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookDisplay", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookDisplay");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            statusFormatter: function() {
                
            }
        });
    });