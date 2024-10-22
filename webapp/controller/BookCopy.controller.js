sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "zkzilibraryproject/model/Service",
    "sap/m/MessageBox"
],

    function (Base, Service, MessageBox){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookCopy", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookCopy");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(){
                const book = {
                    Bookid: this.getView().byId("bookcopy_field_title").getValue(),
                    Availability: this.getView().byId("bookStatusComboBox").getSelectedKey()
                }

                try{
                    await Service.updateBookCopy(this.getOwnerComponent().getModel(), book);

                this.getView().getModel().submitChanges({
                    success: () => {
                        sap.m.MessageToast.show("Successfully saved!");
                        
                        this.getOwnerComponent().getModel().refresh(true);
                        
                        this.onNavBack();
                    },
                    error: () => {
                        sap.m.MessageToast.show("An error occured!");
                    }
                })
                } catch(oError){
                    console.log(oError);
                }  
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                });
            },

            onDeletePressed: function(){
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion"),
                    Bookid = this.getView().byId("bookcopy_field_bookid").getValue();

                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if (MessageBox.Action.YES === sAction) {
                            Service.deleteBookCopy(this.getOwnerComponent().getModel(), Bookid)
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

            stateAvailabilityFormatter: function(Availability){
                if(Availability ===  "AVAILABLE"){
                    return "Success";
                }
                else if(Availability === "NOT AVAILABLE"){
                    return "Warning";
                }
                else{
                    return "Error";
                }
            },

            iconAvailabilityFormatter: function(Availability){
                if(Availability ===  "AVAILABLE"){
                    return "sap-icon://message-success";
                }
                else if(Availability === "NOT AVAILABLE"){
                    return "sap-icon://message-warning";
                }
                else{
                    return "sap-icon://message-error";
                }
            }
        });
    });