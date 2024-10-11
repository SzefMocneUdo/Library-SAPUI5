sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox"
],

    function (Base, MessageBox){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.GenreDetails", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("GenreDetails");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },


            onEditPressed: function(oEvent){

                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("GenreEdit", {
                    path: encodeURIComponent(path)
                });
            },

            onDeletePressed: function(){ //Delete entity
                let sPath = this.getView().getElementBinding().getPath(),
                    i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("Are You sure?");

                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if (MessageBox.Action.YES === sAction) {
                            this.getView().getModel().remove(sPath, {
                                success: () => {
                                    this.onNavBack();
                                },
                                error: (oError) => {
                                    sap.m.MessageToast.show("An error occured!", oError);
                                }
                            })
                        }
                    }
                })
            },

            onCreateTranslationPressed: function(oEvent) {
                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("CreateGenreTranslation", {
                    path: encodeURIComponent(path)
                });
            }
        });
    });