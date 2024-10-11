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
                success: resolve,
                error: function (oError) {
                    console.error("Błąd podczas tworzenia książki:", oError);
                    reject(oError);
                }
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
                    let oTable = sap.ui.getCore().byId("main_table_books");
                    if(oTable) {
                        oTable.getBinding("items").refresh();
                    }

                    resolve();
                },
                error: function (oError) {
                    console.error("Błąd podczas aktualizacji książki:", oError);
                    reject(oError);
                }
            });
        });
    };
    

    static createAuthBook(model, isbn, authorid) {
        return new Promise(function (resolve, reject) {
            model.create("/AuthorBookSet", {
                Authorid: authorid,
                ISBN: isbn
            }, {
                success: resolve,
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
                success: resolve,
                error: reject
            });
        });
    };

    static deleteAuthBook(model, isbn, authorid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/AuthorBookSet(Authorid=guid'${authorid}',ISBN='${isbn}')`, {
                Authorid: authorid,
                ISBN: isbn
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static deleteBookGenre(model, isbn, genreid) {
        return new Promise(function (resolve, reject) {
            model.remove(`/BookGenreSet(ISBN='${isbn}',Genreid=guid'${genreid}')`, {
                ISBN: isbn,
                Genreid: genreid
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static deleteAllAuthorsByISBN(model, isbn) {
        return new Promise(function (resolve, reject) {
            model.read("/BookSet('" + isbn + "')/ToAuthorBookSet", {
                success: function (data) {
                    if (data.results && data.results.length > 0) {
                        let deletePromises = data.results.map(function (author) {
                            Service.deleteAuthBook(model, isbn, author.Authorid);
                        });
    
                        Promise.all(deletePromises)
                            .then(() => {
                                resolve();
                            })
                            .catch(reject);
                    } else {
                        resolve();
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    static deleteAllGenresByISBN(model, isbn) {
        return new Promise(function (resolve, reject) {
            model.read("/BookSet('" + isbn + "')/ToBookGenreSet", {
                success: function (data) {
                    if (data.results && data.results.length > 0) {
                        let deletePromises = data.results.map(function (genre) {
                            Service.deleteBookGenre(model, isbn, genre.Genreid);
                        });
    
                        Promise.all(deletePromises)
                            .then(() => {
                                resolve();
                            })
                            .catch(reject);
                    } else {
                        resolve();
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

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
                error: function (oError) {
                    console.error("Error during a new genre creation:", oError);
                    let messageText = oError.responseText.split('message')[3];
	                sap.m.MessageToast.show(messageText);
                    reject(oError);
                }
            })
        })
    }

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
                error: function (oError) {
                    console.error("Błąd podczas tworzenia książki:", oError);
                    reject(oError);
                }
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
                error: function (oError) {
                    console.error("Błąd podczas aktualizacji translacji:", oError);
                    reject(oError);
                }
            });
        });
    };

    static deleteGenreText(model, genreid, spras) {
        return new Promise(function (resolve, reject) {
            model.remove(`/GenreTextSet(Spras='${spras}',Genreid=guid'${genreid}')`, {
                Spras: spras,
                Genreid: genreid
            }, {
                success: resolve,
                error: function (oError) {
                    // var a = JSON.parse(response.responseText);
                    // var errDetails = a.error.inererror.errordetails;
                    // BaseAudioContext.manageErrors(errDetails);
                    reject
                }
            });
        });
    };
    
});
