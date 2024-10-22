sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "zkzilibraryproject/model/service",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast"
],

    function (Base, Service, DateFormat, MessageToast){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.CreateBook", {
            onInit: function(){
            },

            onCreatePressed: async function() {
                const publicationDate = this.getView().byId("bookcreate_input_publication_date").getValue();
                const book = {
                    ISBN: this.getView().byId("bookcreate_input_isbn").getValue(),
                    Title: this.getView().byId("bookcreate_input_title").getValue(),
                    PublicationDate: publicationDate === "" ? null : `${DateFormat.getDateInstance({
                       pattern: "yyyy-MM-dd"
                    }).format(new Date(publicationDate))}T00:00:00`,
                    Language: this.getView().byId("bookcreate_languageComboBox").getSelectedKey(),
                    Description: this.getView().byId("bookcreate_input_description").getValue()
                }
            
                const authors = this.getView().byId("bookcreate_authorsMultiComboBox").getSelectedKeys();
                const genres = this.getView().byId("bookcreate_genresMultiComboBox").getSelectedKeys();
            
                try {
                    if (book.ISBN === "") {
                        MessageToast.show("ISBN cannot be empty");
                        return;
                    }
                    if (book.Title === "") {
                        MessageToast.show("Title cannot be empty");
                        return;
                    }
                    if (authors.length === 0) {
                        MessageToast.show("Authors cannot be empty");
                        return;
                    }
                    if (genres.length === 0) {
                        MessageToast.show("Genres cannot be empty");
                        return;
                    }
                    if (book.PublicationDate === "") {
                        MessageToast.show("Publication Date cannot be empty");
                        return;
                    }
                    if (book.Language === "") {
                        MessageToast.show("Language cannot be empty");
                        return;
                    }
                    if (book.Description === "") {
                        MessageToast.show("Description cannot be empty");
                        return;
                    }
            
                    await Service.createBook(this.getOwnerComponent().getModel(), book);

                    for (let i = 0; i < authors.length; i++) {
                        await Service.createAuthBook(this.getOwnerComponent().getModel(), book.ISBN, authors[i]);
                    }
                    for (let i = 0; i < genres.length; i++) {
                        await Service.createBookGenre(this.getOwnerComponent().getModel(), book.ISBN, genres[i]);
                    }


                    this.getOwnerComponent().getModel().refresh(true);
                    this.onNavBack();
            
                } catch (oError) {
                    MessageToast.show(this.getErrorMessage(oError));
                }
            },
            
            
            onCancelCreatePressed: function(){
                this.getView().getModel().resetChanges().then(() => {
                    this.onNavBack();
                })
            },
        });
    });