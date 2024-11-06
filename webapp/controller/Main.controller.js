sap.ui.define([
    "zkzilibraryproject/controller/Base.controller",
    "sap/m/Popover",
    "sap/m/library",
    "sap/m/Button",
    "zkzilibraryproject/model/Service"
],
function (Base, Popover, library, Button, Service) {
    "use strict";

    var PlacementType = library.PlacementType,
        ButtonType = library.ButtonType;

    return Base.extend("zkzilibraryproject.controller.Main", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.initialize();
            this.setUserRole();
        },

        setUserRole: function () {
            return new Promise((resolve) => {
                Service.getUserInfo(this.getOwnerComponent().getModel()).then((urole) => {                    
                    if (urole.results[0].Role === 'ADM') {
                        this.getView().byId("MaintenancePanelSideNavigation").setVisible(true);
                    }                         
                    resolve();
                }).catch((oError) => {
                    console.error(oError);
                    resolve();
                });
            });
        },

        onPress: function(){
            let oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo("Books");
        },

        onCollapseExpandPress() {
			const oSideNavigation = this.byId("sideNavigation"),
				bExpanded = oSideNavigation.getExpanded();

			oSideNavigation.setExpanded(!bExpanded);
		},

		onHideShowWalkedPress() {
			const oNavListItem = this.byId("walked");
			oNavListItem.setVisible(!oNavListItem.getVisible());
		},

        handleUserNamePress: function (event) {
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: 'Feedback',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Help',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Logout',
						type: ButtonType.Transparent
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(event.getSource());
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("navpage");
			var bSideExpanded = oToolPage.getSideExpanded();

			this._setToggleButtonTooltip(bSideExpanded);

			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

        onSideNavigationItemSelected: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();

            switch (sKey) {
                case "Books":
                    this.getOwnerComponent().getRouter().navTo("Books");
                    break;
				case "UserLoans":
                    this.getOwnerComponent().getRouter().navTo("UserLoans");
                    break;
				case "UserReservations":
                    this.getOwnerComponent().getRouter().navTo("UserReservations");
                    break;
                case "UserRatings":
                    this.getOwnerComponent().getRouter().navTo("UserRatings");
                    break;
                case "BooksMaintenance":
                    this.getOwnerComponent().getRouter().navTo("BooksMaintenance");
                    break;
				case "ReservationsMaintenance":
                    this.getOwnerComponent().getRouter().navTo("ReservationsMaintenance");
                    break;
				case "LoansMaintenance":
                    this.getOwnerComponent().getRouter().navTo("LoansMaintenance");
                    break;
				case "GenresMaintenance":
                    this.getOwnerComponent().getRouter().navTo("GenresMaintenance");
                    break;
                case "AuthorsMaintenance":
                    this.getOwnerComponent().getRouter().navTo("AuthorsMaintenance");
                    break;
                default:
                    this.getOwnerComponent().getRouter().navTo("Books");
                    break;
            }
        },

        _setToggleButtonTooltip: function (bLarge) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		}
    });
});
