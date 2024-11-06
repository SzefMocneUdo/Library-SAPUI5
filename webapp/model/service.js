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
                Title: translation.Title,
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

    static createLoan(model, loan) {
        return new Promise(function (resolve, reject) {
            model.create('/LoanSet', {
                Reader: loan.Reader,
                StartDate: loan.StartDate,
                EndDate: loan.EndDate
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static updateLoan(model, loan) {
        return new Promise(function (resolve, reject) {
            model.update(`/LoanSet(guid'${loan.Loanid}')`, {
                Loanid: loan.Loanid,
                Status: loan.Status,
                ReturnDate: loan.ReturnDate
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static createBookLoan(model, bookid, loanid) {
        return new Promise(function (resolve, reject) {
            model.create('/BookLoanSet', {
                Bookid: bookid,
                Loanid: loanid
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static createReservation(model, Reservation) {
        return new Promise(function (resolve, reject) {
            model.create('/ReservationSet', {
                Reader: Reservation.Reader,
                StartDate: Reservation.StartDate,
                EndDate: Reservation.EndDate
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static updateReservation(model, Reservation) {
        return new Promise(function (resolve, reject) {
            model.update(`/ReservationSet(guid'${Reservation.Reservationid}')`, {
                Reservationid: Reservation.Reservationid,
                Status: Reservation.Status
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static createBookReservation(model, bookid, Reservationid) {
        return new Promise(function (resolve, reject) {
            model.create('/BookReservationSet', {
                Bookid: bookid,
                Reservationid: Reservationid
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static getUserInfo(model) {
        return new Promise(function (resolve, reject) {
            model.read('/UserInfoSet', {
                success: resolve,
                error: reject
            });
        });
    };

    static createRating(model, isbn, rating) {
        return new Promise(function (resolve, reject) {
            model.create('/RateSet', {
                ISBN: isbn,
                Rating: rating
            }, {
                success: resolve,
                error: reject
            });
        });
    };

    static deleteRating(model, path) {
        return new Promise(function (resolve, reject) {
            model.remove(path, {
                success: resolve,
                error: reject
            });
        });
    };

});
