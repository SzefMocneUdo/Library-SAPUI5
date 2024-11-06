sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/service"
],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.AuthorEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("AuthorEdit");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);

                const regex = /guid'([0-9a-fA-F-]{36})'/;
                const match = sPath.match(regex);

                let oModel = this.getOwnerComponent().getModel();
                oModel.read(`/AuthorSet(${match[0]})`, {
                    success: function(oData) {
                        let oModelList = new sap.ui.model.json.JSONModel();
                        oModelList.setData(oData);
                        this.getOwnerComponent().setModel(oModelList, "test");
                    }.bind(this)
                })
            },

            onSavePressed: async function(oEvent){
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle();

                const translation = {
                    Authorid: oEvent.getSource().getBindingContext().getProperty("Authorid"),
                    Spras: this.getView().byId("AuthorTranslationLanguageText").getValue(),
                    Description: this.getView().byId("AuthorTranslationDescriptioninput").getValue()
                }

                try{
                    if (translation.Spras === "") {
                        sap.m.MessageToast.show(oResourceBundle.getText("LanguageEmpty"));
                    }
                    else if (translation.Description === ""){
                        sap.m.MessageToast.show(oResourceBundle.getText("DescriptionEmpty"));
                    }
                    else{
                        await Service.updateAuthorText(this.getOwnerComponent().getModel(), translation);

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

                    let authorid = oEvent.getSource().getBindingContext().getProperty("Authorid");
                    let spras = this.getView().byId("AuthorTranslationLanguageText").getValue();

                    MessageBox.confirm(sText, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: (sAction) => {
                            if (MessageBox.Action.YES === sAction) {
                                Service.deleteAuthorText(this.getOwnerComponent().getModel(), authorid, spras)
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