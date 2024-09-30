sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("zkzilibraryproject.controller.Main", {
        onInit: function () {
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
		}
    });
});
