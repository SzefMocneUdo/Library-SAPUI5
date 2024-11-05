sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("zkzilibraryproject.controller.Books", {
        onInit: function () {
        },

        onNavToDetail: function(oEvent) {
            let oRouter = this.getOwnerComponent().getRouter();
            const sPath = oEvent.getSource().getBindingContext().getPath();

            oRouter.navTo("BookDisplay", {
                path: encodeURIComponent(sPath)
            });
        },

        onSearch: function(oEvent) {
            let filter;
			let sQuery = oEvent.getSource().getValue();

			if (sQuery && sQuery.length > 0) {
                sQuery = sQuery.toUpperCase();
				filter = [new Filter("ISBN", FilterOperator.Contains, sQuery),
                          new Filter("Title", FilterOperator.Contains, sQuery)];
			}
            this.getView().byId("main_table_books").getBinding("items").filter(filter);
        }
    });
});
