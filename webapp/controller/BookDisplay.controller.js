sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "zkzilibraryproject/model/Service",
    'sap/ui/core/Fragment',
    'sap/m/MessageBox'
],

    function (Base, Service, Fragment, MessageBox){
        "use strict";
        return Base.extend("zkzilibraryproject.controller.BookDisplay", {
            onInit: function(){
                let oRouter = this.getOwnerComponent().getRouter(),
                    oRoute = oRouter.getRoute("BookDisplay");
                
                oRoute.attachPatternMatched(this.onPatternMatched, this);
            },

            onPatternMatched: function(oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);

                this.getView().bindElement(sPath);
            },

            onAddRating: async function () {
                let i18nModel = this.getView().getModel("i18n");
                sap.ui.getCore().setModel(i18nModel, "i18n");

                this.oDialog ??= await Fragment.load({
                    id: this.getView().getId(),
                    name: "zkzilibraryproject.fragment.CreateRatingDialog",
                    controller: this
                });

                this.oDialog.open();
            },

            closeDialog: function () {
                this.oDialog.close();
                this.oDialog.destroy();
                this.oDialog = null;
    
                this.getView().getModel().refresh(true);
            },

            onSavePressed: async function () {
                let isbn = this.getView().byId("BookISBNText").getText();
                let rating = this.getView().byId("CreateRating_RatingIndicator").getValue();

                try {
                    await Service.createRating(this.getOwnerComponent().getModel(), isbn, rating);

                    this.getView().getModel().submitChanges({
                        success: () => {
                            sap.m.MessageToast.show("Your rating has been created")
                            this.getOwnerComponent().getModel().refresh(true);
                            this.closeDialog();
                        },
                        error: () => {
                            sap.m.MessageToast.show("An error occurred!");
                        }
                    });
                } catch (oError) {
                    MessageBox.error(this.getErrorMessage(oError));
                }
            },

            onCreateReservation: async function() {
                try {

                    let isbn = this.getView().byId("BookISBNText").getText();
                    
                    let oModel = this.getOwnerComponent().getModel();                    
                    
                    let copies = await new Promise((resolve, reject) => {
                        oModel.read(`/BookSet('${isbn}')/ToBook_copySet`, {
                            success: function (oData) {
                                resolve(oData.results);
                            },
                            error: function (oError) {
                                reject(oError);
                            }
                        });
                    });

                    let Availability = false;
                    let book;

                    for( let i = 0; i < copies.length; i++) {
                        if (copies[i].Availability === 'AVAILABLE') {
                            Availability = true;
                            book = copies[i].Bookid;
                        };
                    };
                    
                    if (Availability === false) {
                        MessageBox.error("Book is not available");
                    } else {
                        const reservation = {
                            Reader: null,
                            StartDate: null,
                            EndDate: null
                        }

                        const createdreservation = await Service.createReservation(oModel, reservation);
                        await Service.createBookReservation(oModel, book, createdreservation.Reservationid);

                        this.getView().getModel().submitChanges({
                            success: () => {
                                MessageBox.information(`A new reservation with ID: '${createdreservation.Reservationid}' has been created`);
                                this.getOwnerComponent().getModel().refresh(true);
                            },
                            error: () => {
                                sap.m.MessageToast.show("An error occurred!");
                            }
                        });
                    }
                } catch (oError) {
                    MessageBox.error(this.getErrorMessage(oError))
                }
            },
            
        });
    });