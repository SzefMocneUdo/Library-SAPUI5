sap.ui.define([
    "zkzilibraryproject/controller/Base.controller"
], () => class Service {
    static createBook(model, book) {
        return new Promise(function (resolve, reject) {
            model.create("/BookSet", {
                ISBN: book.ISBN,
                Title: book.Title,
                Language: book.Language,
                PublicationDate: book.PublicationDate,
                Description: book.Description
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("booksmaintenance_table_books");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static updateBook(model, book) {
        return new Promise(function (resolve, reject) {
            model.update(`/BookSet('${book.ISBN}')`, {
                ISBN: book.ISBN,
                Title: book.Title,
                Language: book.Language,
                PublicationDate: book.PublicationDate,
                Description: book.Description
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("booksmaintenance_table_books");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static deleteBook(model, ISBN) {
        return new Promise(function (resolve, reject) {
            model.remove(`/BookSet('${ISBN}')`, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("booksmaintenance_table_books");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };
    
    static createAuthBook(model, isbn, authorid) {
        return new Promise(function (resolve, reject) {
            model.create("/AuthorBookSet", {
                Authorid: authorid,
                ISBN: isbn
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("booksmaintenance_table_books");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static createBookGenre(model, isbn, genreid) {
        return new Promise(function (resolve, reject) {
            model.create("/BookGenreSet", {
                ISBN: isbn,
                Genreid: genreid
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("booksmaintenance_table_books");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static deleteAuthBook(model, isbn, authorid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/AuthorBookSet(Authorid=guid'${authorid}',ISBN='${isbn}')`,  {
                success: resolve,
                error: reject
            });
        });
    };

    static deleteBookGenre(model, isbn, genreid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/BookGenreSet(ISBN='${isbn}',Genreid=guid'${genreid}')`, {
                success: resolve,
                error: reject
            });
        });
    };

    // static deleteAllAuthorsByISBN(model, isbn) {
    //     return new Promise(function (resolve, reject) {
    //         model.read("/BookSet('" + isbn + "')/ToAuthorBookSet", {
    //             success: function (data) {
    //                 if (data.results && data.results.length > 0) {
    //                         for (let i = 0; i < data.results.length; i++) {
    //                             let author = data.results[i];
    //                             Service.deleteAuthBook(model, isbn, author.Authorid);
    //                             this.getView().getModel().submitChanges({
    //                                 success: resolve,
    //                                 error: () => sap.m.MessageToast.show("Error deleting authors!")
    //                             });
    //                     }
    //                 } else {
    //                     resolve(); // Brak autorów do usunięcia
    //                 }
    //             },
    //             error: reject
    //         });
    //     });
    // }
    

    // static deleteAllGenresByISBN(model, isbn) {
    //     return new Promise(function (resolve, reject) {
    //         model.read("/BookSet('" + isbn + "')/ToBookGenreSet", {
    //             success: function (data) {
    //                 if (data.results && data.results.length > 0) {
    //                         for(let i = 0; i < data.results.length; i++){
    //                             const genre = data.results[i];
    //                             Service.deleteBookGenre(model, isbn, genre.Genreid);
    //                             this.getView().getModel().submitChanges({
    //                                 success: resolve,
    //                                 error: () => sap.m.MessageToast.show("Error deleting authors!")
    //                             });
    //                         }
    //                 } else {
    //                     resolve();
    //                 }
    //             },
    //             error: reject
    //         });
    //     });
    // }

    static createGenre(model, name, description) {
        return new Promise(function (resolve, reject) {
            model.create("/GenreSet", {
                Name: name,
                Description: description
            }, {
                success: function() {
                    let oTable = sap.ui.getCore().byId("main_table_genresmaintenance");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            })
        })
    }

    static deleteGenre(model, genreid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/GenreSet(guid'${genreid}')`, {
                success: resolve,
                error: reject
            });
        });
    };

    static createGenreText(model, translation) {
        return new Promise(function (resolve, reject) {
            model.create("/GenreTextSet", {
                Spras: translation.Spras,
                Genreid: translation.Genreid,
                Name: translation.Name,
                Description: translation.Description
            }, {
                success: function() {
                    let oTable = sap.ui.getCore().byId("table_genresmaintenance_translations");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static updateGenreText(model, translation) {
        return new Promise(function (resolve, reject) {
            model.update(`/GenreTextSet(Spras='${translation.Spras}',Genreid=guid'${translation.Genreid}')`, {
                Spras: translation.Spras,
                Genreid: translation.Genreid,
                Name: translation.Name,
                Description: translation.Description
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("table_genresmaintenance_translations");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static deleteGenreText(model, genreid, spras) {
        return new Promise(function (resolve, reject) {
            model.remove(`/GenreTextSet(Spras='${spras}',Genreid=guid'${genreid}')`, {
                success: resolve,
                error: reject
            });
        });
    };
    

    static createAuthor(model, Author) {
        return new Promise(function (resolve, reject) {
            model.create("/AuthorSet", {
                Name: Author.Name,
                Surname: Author.Surname,
                Nationality: Author.Nationality,
                Description: Author.Description
            }, {
                success: function() {
                    let oTable = sap.ui.getCore().byId("main_table_authorsmaintenance");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            })
        })
    };

    static deleteAuthor(model, authorid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/AuthorSet(guid'${authorid}')`, {
                success: resolve,
                error: reject
            });
        });
    };

    static createAuthorText(model, translation) {
        return new Promise(function (resolve, reject) {
            model.create("/AuthorTextSet", {
                Spras: translation.Spras,
                Authorid: translation.Authorid,
                Description: translation.Description
            }, {
                success: function() {
                    let oTable = sap.ui.getCore().byId("table_authorsmaintenance_translations");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }
                    resolve();
                },
                error: reject
            });
        });
    };

    static updateAuthorText(model, translation) {
        return new Promise(function (resolve, reject) {
            model.update(`/AuthorTextSet(Spras='${translation.Spras}',Authorid=guid'${translation.Authorid}')`, {
                Spras: translation.Spras,
                Authorid: translation.Authorid,
                Description: translation.Description
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("table_authorsmaintenance_translations");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static deleteAuthorText(model, authorid, spras) {
        return new Promise(function (resolve, reject) {
            model.remove(`/AuthorTextSet(Spras='${spras}',Authorid=guid'${authorid}')`, {
                success: resolve,
                error: reject
            });
        });
    };

    static createBookText(model, translation) {
        return new Promise(function (resolve, reject) {
            model.create("/BookTextSet", {
                Spras: translation.Spras,
                ISBN: translation.ISBN,
                Title: translation.Title,
                Description: translation.Description
            }, {
                success: function() {
                    let oTable = sap.ui.getCore().byId("table_booksmaintenance_translations");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }
                    resolve();
                },
                error: reject
            });
        });
    };

    static updateBookText(model, translation) {
        return new Promise(function (resolve, reject) {
            model.update(`/BookTextSet(Spras='${translation.Spras}',ISBN='${translation.ISBN}')`, {
                Spras: translation.Spras,
                ISBN: translation.ISBN,
                Title: translation.title,
                Description: translation.Description
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("table_booksmaintenance_translations");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static deleteBookText(model, ISBN, spras) {
        return new Promise(function (resolve, reject) {
            model.remove(`/BookTextSet(Spras='${spras}',ISBN='${ISBN}')`, {
                success: resolve,
                error: reject
            });
        });
    };

    static updateBookCopy(model, book) {
        return new Promise(function (resolve, reject) {
            model.update(`/Book_copySet(guid'${book.Bookid}')`, {
                Bookid: book.Bookid,
                Availability: book.Availability
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("table_booksmaintenance_copy");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static createBookCopy(model, ISBN, Availability) {
        return new Promise(function (resolve, reject) {
            model.create('/Book_copySet', {
                ISBN: ISBN,
                Availability: Availability
            }, {
                success: function () {
                    let oTable = sap.ui.getCore().byId("table_booksmaintenance_copy");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: reject
            });
        });
    };

    static deleteBookCopy(model, Bookid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/Book_copySet(guid'${Bookid}')`, {
                success: resolve,
                error: reject
            });
        });
    };

});
