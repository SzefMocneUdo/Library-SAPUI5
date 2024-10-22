sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookTranslationEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookTranslationEdit");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(oEvent){
                const translation = {
                    ISBN: oEvent.getSource().getBindingContext().getProperty("ISBN"),
                    Spras: this.getView().byId("BookTranslationEditLanguageText").getValue(),
                    Title: this.getView().byId("BookTranslationEditTitleinput").getValue(),
                    Description: this.getView().byId("BookTranslationEditDescriptioninput").getValue()
                }             

                try{
                    if (translation.Spras === "") {
                        sap.m.MessageToast.show("Language cannot be empty");
                    }
                    else if (translation.Title === ""){
                        sap.m.MessageToast.show("Title cannot be empty");
                    }
                    else if (translation.Description === ""){
                        sap.m.MessageToast.show("Description cannot be empty");
                    }
                    else{                  
                        await Service.updateBookText(this.getOwnerComponent().getModel(), translation);

                        this.getView().getModel().submitChanges({
                            success: () => {
                                sap.m.MessageToast.show("Successfully saved!");
                        
                                this.getOwnerComponent().getModel().refresh(true);

                                this.onNavBack();
                            },
                            error: (oError) => {
                                sap.m.MessageToast.show(this.getErrorMessage(oError));
                            }
                        })
                    }
                } catch (oError) {
                    sap.m.MessageToast.show(this.getErrorMessage(oError));
                }
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                });
            },

            onDeletePressed: function(oEvent){
                    const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                    let sText = oResourceBundle.getText("deleteQuestion");

                    let ISBN = oEvent.getSource().getBindingContext().getProperty("ISBN");
                    let spras = this.getView().byId("BookTranslationEditLanguageText").getValue();

                    MessageBox.confirm(sText, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: (sAction) => {
                            if (MessageBox.Action.YES === sAction) {
                                Service.deleteBookText(this.getOwnerComponent().getModel(), ISBN, spras)
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
        });
    });