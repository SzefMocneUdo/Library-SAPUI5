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
            model.update("/BookSet", {
                ISBN: book.ISBN,
                Title: book.Title,
                Language: book.Language,
                PublicationDate: book.PublicationDate,
                Description: book.Description
            }, {
                success: resolve,
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

    static deleteAuthBook(model, isbn) {
        return new Promise(function (resolve, reject) {
            model.delete("/AuthorBookSet", {
                ISBN: isbn
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static deleteBookGenre(model, isbn) {
        return new Promise(function (resolve, reject) {
            model.delete("/BookGenreSet", {
                ISBN: isbn
            }, {
                success: resolve,
                error: reject
            });
        });
    };
});
