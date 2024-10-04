sap.ui.define([], () => class Service {
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
    
});
