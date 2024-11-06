sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.GenreEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("GenreEdit");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(oEvent){
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle();

                const translation = {
                    Genreid: oEvent.getSource().getBindingContext().getProperty("Genreid"),
                    Spras: this.getView().byId("GenreTranslationLanguageText").getValue(),
                    Name: this.getView().byId("GenreTranslationNameinput").getValue(),
                    Description: this.getView().byId("GenreTranslationDescriptioninput").getValue()
                }

                try{
                    if (translation.Spras === "") {
                        sap.m.MessageToast.show(oResourceBundle.getText("LanguageEmpty"));
                    }
                    else if (translation.Name === ""){
                        sap.m.MessageToast.show(oResourceBundle.getText("NameEmpty"));
                    }
                    else if (translation.Description === ""){
                        sap.m.MessageToast.show(oResourceBundle.getText("DescriptionEmpty"));
                    }
                    else{
                        await Service.updateGenreText(this.getOwnerComponent().getModel(), translation);

                        this.getView().getModel().submitChanges({
                            success: () => {
                                sap.m.MessageToast.show(oResourceBundle.getText("SuccessfullySaved"));
                        
                                this.getOwnerComponent().getModel().refresh(true);

                                this.onNavBack();
                            },
                            error: () => {
                                sap.m.MessageToast.show(oResourceBundle.getText("ErrorOccured"));
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

                    let genreid = oEvent.getSource().getBindingContext().getProperty("Genreid");
                    let spras = this.getView().byId("GenreTranslationLanguageText").getValue();

                    MessageBox.confirm(sText, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: (sAction) => {
                            if (MessageBox.Action.YES === sAction) {
                                Service.deleteGenreText(this.getOwnerComponent().getModel(), genreid, spras)
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