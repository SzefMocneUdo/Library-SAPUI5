sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "zkzilibraryproject/model/Service",

],

    function (Base, MessageBox, Service){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookDetails", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookDetails");
                
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

                oRouter.navTo("BookEdit", {
                    path: encodeURIComponent(path)
                });
            },

            onEditTranslationPressed: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("BookTranslationEdit", {
                    path: encodeURIComponent(path)
                });
            },

            onCreateTranslationPressed: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("CreateBookTranslation", {
                    path: encodeURIComponent(path)
                });
            },

            onCreateCopyPressed: async function () {
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle();

                try{
                    await Service.createBookCopy(this.getOwnerComponent().getModel(),
                                                this.getView().byId("bookdetails_field_isbn").getValue(),
                                                "AVAILABLE");

                    this.getView().getModel().submitChanges({
                    success: () => {
                        sap.m.MessageToast.show(oResourceBundle.getText("Success"));
                        
                        this.getOwnerComponent().getModel().refresh(true);
                    },
                    error: (oError) => {
                        sap.m.MessageToast.show(this.getErrorMessage(oError));
                    }
                })                   
                    
                } catch (oError) {
                    sap.m.MessageToast(this.getErrorMessage(oError));
                }
            },

            onDisplayCopyPressed: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();

                const path = oEvent.getSource().getBindingContext().getPath();

                oRouter.navTo("BookCopy", {
                    path: encodeURIComponent(path)
                });
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    onNavBack();
                });
            },

            onDeletePressed: async function(){
                let i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion"),
                    ISBN = this.getView().byId("bookdetails_field_isbn").getValue(),
                    oModel = this.getOwnerComponent().getModel();

                let Success = oResourceBundle.getText("Success");
            
                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: async (sAction) => {
                        if (MessageBox.Action.YES === sAction) {
                            const copies = [];
                            const authors = [];
                            const genres = [];
                            let sPathBook_copy = "/BookSet('" + ISBN + "')/ToBook_copySet"
                            let sPathAuthorBook = "/BookSet('" + ISBN + "')/ToAuthorBookSet";
                            let sPathBookGenre = "/BookSet('" + ISBN + "')/ToBookGenreSet";
                            
                            try {
                                await new Promise((resolve, reject) => {
                                    oModel.read(sPathBook_copy, {
                                        success: function (oData) {
                                            oData.results.forEach(element => {
                                                copies.push(element.Bookid);
                                            });
                                            resolve();
                                        },
                                        error: function (oError) {
                                            reject(oError);
                                        }
                                    });
                                });
            
                                for (let i = 0; i < copies.length; i++) {                 
                                    await Service.deleteBookCopy(oModel, copies[i]);
                                }

                                await new Promise((resolve, reject) => {
                                    oModel.read(sPathAuthorBook, {
                                        success: function (oData) {
                                            oData.results.forEach(element => {
                                                authors.push(element.Authorid);
                                            });
                                            resolve();
                                        },
                                        error: function (oError) {
                                            reject(oError);
                                        }
                                    });
                                });
            
                                for (let i = 0; i < authors.length; i++) {
                                    await Service.deleteAuthBook(oModel, ISBN, authors[i]);
                                }
            
                                await new Promise((resolve, reject) => {
                                    oModel.read(sPathBookGenre, {
                                        success: function (oData) {
                                            oData.results.forEach(element => {
                                                genres.push(element.Genreid);
                                            });
                                            resolve();
                                        },
                                        error: function (oError) {
                                            reject(oError);
                                        }
                                    });
                                });
            
                                for (let i = 0; i < genres.length; i++) {
                                    await Service.deleteBookGenre(oModel, ISBN, genres[i]);
                                }
            
                                await Service.deleteBook(oModel, ISBN);
            
                                this.getView().getModel().submitChanges({
                                    success: () => sap.m.MessageToast.show(Success),
                                    error: () => sap.m.MessageToast.show(oResourceBundle.getText("ErrorOccured"))
                                });
                                
                                let oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("BooksMaintenance", {}.true);
            
                            } catch (oError) {
                                sap.m.MessageToast.show(this.getErrorMessage(oError));
                            }
                        }
                    }
                });
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