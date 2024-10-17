sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/Service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.AuthorDetails", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("AuthorDetails");
                
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

                oRouter.navTo("AuthorEdit", {
                    path: encodeURIComponent(path)
                });
            },

            onDeletePressed: function(){ //Delete entity
                let sPath = this.getView().getElementBinding().getPath(),
                    i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("Are You sure?"),
                    authorid = this.getView().byId("authordetails_field_authorid").getValue();

                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if (MessageBox.Action.YES === sAction) {
                            Service.deleteAuthor(this.getOwnerComponent().getModel(), authorid)
                                .then(() => {
                                    sText = oResourceBundle.getText("Success");
                                    sap.m.MessageToast.show(sText);
                                    this.onNavBack();
                                })
                                .catch((oError) => {
                                    sap.m.MessageToast.show(this.getErrorMessage(oError))
                                });
                        }
                    }
                })
            },

            onCreateTranslationPressed: function(oEvent) {
                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("CreateAuthorTranslation", {
                    path: encodeURIComponent(path)
                });
            }
        });
    });