sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Button",
    "sap/ui/model/json/JSONModel"
],
function (Controller, Dialog, mobileLibrary, List, StandardListItem, Button, JSONModel) {
    "use strict";

    // shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

    return Controller.extend("zkzilibraryproject.controller.Loans", {
        onInit: function () {
            // var oViewModel,
			// 	iOriginalBusyDelay,
			// 	oTable = this.byId("main_table_userloans");

			// iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// this._oTable = oTable;
			// // keeps the search state
			// this._aTableSearchState = [];

			// // Model used to manipulate control states
			// oViewModel = new JSONModel({
			// 	worklistTableTitle: this.getResourceBundle().getText("worklistTableTitleUserLoans"),
			// 	shareOnJamTitle: this.getResourceBundle().getText("LoansTitle"),
			// 	// tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
			// 	tableBusyDelay: 0,
			// 	finished: 0,
			// 	inprogress: 0,
			// 	delayed: 0,
			// 	countAll: 0
			// });
			// this.setModel(oViewModel, "worklistView");
			// // Create an object of filters
			// this._mFilters = {
			// 	"finished": [new Filter("UnitsInStock", FilterOperator.GT, 0)],
			// 	"inprogress": [new Filter("UnitsInStock", FilterOperator.GT, 0)],
			// 	"delayed": [new Filter("UnitsInStock", FilterOperator.GT, 0)],
			// 	"all": []
			// };

			// // Make sure, busy indication is showing immediately so there is no
			// // break after the busy indication for loading the view's meta data is
			// // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			// oTable.attachEventOnce("updateFinished", function(){
			// 	// Restore original busy indicator delay for worklist's table
			// 	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			// });
        },

        onDetailsDialog: function(oEvent) {
            var oLoan = oEvent.getSource().getBindingContext().getObject();
            
            if (!this.oFixedSizeDialog) {
                this.oFixedSizeDialog = new Dialog({
                    title: this.getView().getModel("i18n").getResourceBundle().getText("LoanDetails"),
                    contentWidth: "550px",
                    contentHeight: "300px",
                    content: [
                        new StandardListItem({
                            title: "Loan ID",
                            description: "{/Loanid}"
                        }),
                        new StandardListItem({
                            title: "Status",
                            description: "{/Status}"
                        }),
                        new StandardListItem({
                            title: "Books",
                            description: "{/Books}"
                        }),
                        new StandardListItem({
                            title: "Start Date",
                            description: "{/FormattedStartDate}" 
                        }),
                        new StandardListItem({
                            title: "End Date",
                            description: "{/FormattedEndDate}"
                        }),
                        new StandardListItem({
                            title: "Pickup Date",
                            description: "{/FormattedPickupDate}" 
                        }),
                        new StandardListItem({
                            title: "Return Date",
                            description: "{/FormattedReturnDate}"
                        })
                    ],
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Close",
                        press: function () {
                            this.oFixedSizeDialog.close();
                        }.bind(this)
                    })
                });
                
                this.getView().addDependent(this.oFixedSizeDialog);
            }
             
            const startDate = new Date(oLoan.StartDate);
            const endDate = new Date(oLoan.EndDate);
            const pickupDate = new Date(oLoan.PickupDate);
            const returnDate = new Date(oLoan.ReturnDate);

            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const formattedStartDate = startDate.toLocaleDateString('pl-PL', options);
            const formattedEndDate = endDate.toLocaleDateString('pl-PL', options);
            const formattedPickupDate = pickupDate.toLocaleDateString('pl-PL', options);
            const formattedReturnDate = returnDate.toLocaleDateString('pl-PL', options);
        
            var oDialogModel = new JSONModel({
                Loanid: oLoan.Loanid,
                Status: oLoan.Status,
                Books: oLoan.Books,
                FormattedStartDate: formattedStartDate,
                FormattedEndDate: formattedEndDate,
                FormattedPickupDate: formattedPickupDate,
                FormattedReturnDate: formattedReturnDate
            });
        
            this.oFixedSizeDialog.setModel(oDialogModel);
            
            this.oFixedSizeDialog.open();
        },

        onQuickFilter: function(oEvent) {
			var oBinding = this._oTable.getBinding("items"),
				sKey = oEvent.getParameter("selectedKey");
			oBinding.filter(this._mFilters[sKey]);
		},

        onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("ProductName", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},
    });
});
