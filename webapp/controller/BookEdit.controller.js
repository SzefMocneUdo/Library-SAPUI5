sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat"
],

    function (Base, MessageBox, DateFormat){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookEdit", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookEdit");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);

                this.getVie().byId("bookedit_authorsMultiComboBox").setItems(this.getSelectedKeys())

                // const authors = this.getView().byId("bookdetails_authorsMultiComboBox").getSelectedKeys();
                
                // let oDataModelAuthors = new sap.ui.model.odata.v2.ODataModel("/AuthorSet");

                // let oItemTemplate = new sap.ui.core.Item({
                //     key: "{Authorid}",
                //     text: "{Name}"
                // });

                

                // let mcb = new sap.m.MultiComboBox({
                //     id: "mcb",
                //     items: {
                //         path: "/AuthorSet",
                //         template: oItemTemplate
                //     },
                //     selectedKeys: authors
                // });

                // mcb.setModel(oDataModelAuthors);
                // mcb.placeAt('BookEdit')
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onSavePressed: async function(){
                const publicationDate = this.getView().byId("bookedit_input_publication_date").getValue();
                const isbn = this.getView().byId("bookedit_text_isbn").getText();
                const book = {
                    ISBN: isbn,
                    Title: this.getView().byId("bookedit_input_title").getValue(),
                    PublicationDate: publicationDate === "" ? null : `${DateFormat.getDateInstance({
                       pattern: "yyyy-MM-dd"
                    }).format(new Date(publicationDate))}T00:00:00`,
                    Language: this.getView().byId("bookedit_input_language").getValue(),
                    Description: this.getView().byId("bookedit_input_description").getValue()
                }


                const authors = this.getView().byId("bookedit_authorsMultiComboBox").getSelectedKeys();
                const genres = this.getView().byId("bookedit_genresMultiComboBox").getSelectedKeys();

                console.log(authors);
                console.log(genres);

                // await Service.updateBook(this.getOwnerComponent().getModel(), book);

                // await Service.deleteAuthBook(this.getOwnerComponent().getModel(), book.ISBN);
                // await Service.deleteBookGenre(this.getOwnerComponent().getModel(), book.ISBN);
                
                // for(let i = 0; i < authors.length; i++){
                //     await Service.createAuthBook(this.getOwnerComponent().getModel(), book.ISBN, authors[i]);
                // };

                // for(let i = 0; i < genres.length; i++){
                //     await Service.createBookGenre(this.getOwnerComponent().getModel(), book.ISBN, genres[i]);
                // };

                // this.getView().getModel().submitChanges({
                //     success: () => {
                //         sap.m.MessageToast.show("Successfully saved!");
                //         this.onNavBack();
                //     },
                //     error: () => {
                //         sap.m.MessageToast.show("An error occured!");
                //     }
                // })
            },

            onCancelPressed: function() {
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                });
            },

            onDeletePressed: function(){
                let sPath = this.getView().getElementBinding().getPath(),
                    i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion");

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
                                    sap.m.MessageToast.show("An error occured!");
                                }
                            })
                        }
                    }
                })
            },
        });
    });