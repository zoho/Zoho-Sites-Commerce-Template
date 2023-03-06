function removeClass(element, className) {
	element.className = element.className.replace(className,'');
}
function addClass(element, className) {
	element.classList.add(className);
}
function getTargetContainer(element) {
  var targetContainer = (element) ? element.closest("[data-zs-product-id]") : "";
  return targetContainer;
}
function addToCartSuccess (e) {

	var cartAddSuccess = document.querySelectorAll('[data-cart-add-success="theme-cart-add-success"]')[0];
	var cartMsgFour = document.querySelectorAll('[data-theme-message-four]')[0];
	var quickLookContainer = document.getElementById("product_quick_look");
	addClass(cartAddSuccess,'theme-cart-success');
	removeClass(cartAddSuccess,'theme-cart-success-remove');
	if(cartMsgFour){
		addClass(cartAddSuccess,'theme-cart-added-success');
		removeClass(cartAddSuccess,'theme-cart-added-success-remove');
	}
	if(quickLookContainer && cartMsgFour){
		closeProductQuickLook();
	}
	var addcartButton = e.detail.target;
	removeClass(addcartButton,'theme-cart-loading-container');
	var cartButtonText = addcartButton.querySelectorAll('[data-theme-cart-button-text="theme-cart-button-text"]')[0];
	var cartButtonLoading = addcartButton.querySelectorAll('[data-theme-cart-button-loading="theme-cart-button-loading"]')[0];

	var cartButtonLoadingFive = addcartButton.querySelectorAll('[data-theme-cart-button-loading-five="theme-cart-button-loading-five"]')[0];
	var cartLoadingTwo = addcartButton.querySelectorAll('[data-theme-cart-button-icon="data-theme-cart-button-icon"]')[0];

	if(cartButtonText){
		cartButtonText.style.display = "block";
	}
	if(cartButtonLoading){
		cartButtonLoading.style.display = "none";
	}
	if(cartButtonLoadingFive){
		cartButtonLoadingFive.style.display = "none";
	}
	if(cartLoadingTwo){
		cartLoadingTwo.style.display = "block";
	}

	var targetContainer = getTargetContainer(e.detail.target);

	var prodId = (targetContainer && targetContainer != "") ? targetContainer.getAttribute("data-zs-product-id") : "";

	var errorContainer = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-'+prodId+'"]')[0];

	var errorContainerList = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-list-'+prodId+'"]')[0];

	if(errorContainer){
		errorContainer.style.display = "none";
		errorContainer.innerHTML = "";
	}
	if(errorContainerList){
		errorContainerList.style.display = "none";
		errorContainerList.innerHTML = "";
	}

	var nameContianer = document.querySelectorAll('[data-cart-add-success-prod-name="theme-cart-add-success-prod-name"]')[0];
	var imgContainer = document.querySelectorAll('[data-cart-add-success-prod-img="theme-cart-add-success-prod-img"]')[0];
	var countContainer = document.querySelectorAll('[ data-cart-add-success-count="theme-cart-add-success-prod-count"]')[0];

	var thumbnailImages = document.querySelectorAll('[data-thumbnail]');
	var thumbanailcontainer = document.querySelectorAll('[data-theme-thumbnail-container="theme-thumbnail-container-'+prodId+'"]')[0];
	var detailImage = document.querySelectorAll('[data-detail-image="theme-detail-image"]')[0];

  var thumbcontainerProdId = document.querySelectorAll('[data-thumbnail-prod-id="'+prodId+'"]')[0];

	if(thumbcontainerProdId){
		var detailImageUrl = thumbcontainerProdId.querySelectorAll('[data-thumbnail-active]');
	}
	var firstImgUrl;
	if(thumbcontainerProdId){
		for(iurl=0;iurl<detailImageUrl.length;iurl++){
			var imgUrl = detailImageUrl[iurl].getAttribute('data-thumbnail-active');
			if (iurl == 0) {
				detailImageUrl[iurl].click();
			}
		}
	}
	for(ti=0;ti<thumbnailImages.length;ti++){
		if(thumbnailImages[ti]){
			thumbnailImages[ti].style.display = 'flex';
		}
	}
	if(thumbanailcontainer){
		thumbanailcontainer.style.display = "flex";
	}

	if(thumbanailcontainer){
		activeThumbnail();
	}

	var detail = e.detail;
	var variantId = detail.target.getAttribute("data-zs-product-variant-id");
	var lineItems = detail.cart.items

	var currentLineItem;

	resetSelect(targetContainer);

	for (var lineItem of lineItems) {
	  if (lineItem.variant_id == variantId) {
	      currentLineItem = lineItem;
	      break;
	  }
	}
	if(nameContianer){
		nameContianer.innerHTML = currentLineItem.name;
	}
	if(countContainer){
		countContainer.innerHTML = lineItems.length;
	}
	if (currentLineItem.images) {
	 var imageUrl = currentLineItem.images[0].url;
	 var imageAlt = currentLineItem.images[0].alternate_text;
	 var imageTitle = currentLineItem.images[0].title;
	 if (!currentLineItem.images[0].is_placeholder_image) {
		 imageUrl += "/5";
	 }
	 if(imgContainer){
	 	imgContainer.setAttribute('src', imageUrl);
		imgContainer.setAttribute('alt', imageAlt);
 	 	imgContainer.setAttribute('title', imageTitle);
 	 }
	}

	var customfields = $D.getAll('[data-custom-field-id]', targetContainer);
  customfields.forEach( function (field) {
			var fieldValue =  field.getAttribute('data-default-value');
			var fieldType = field.getAttribute('data-field-type');
      if(fieldType == 'check_box') {
          field.checked = (fieldValue == "true");
      }
			else if(fieldType == 'dropdown' && fieldValue == "" ){
				field.selectedIndex = 0;

			} else if(fieldType == "attachment"){
                var customfieldId = field.getAttribute("data-custom-field-id");
                var variantElement =  field.closest('[data-variant-id]')

                if(variantElement) {
                    field.setAttribute("data-value", "")
                    var attachmentClickElem = $D.get('[data-zs-attachment-upload-custom-field-id="' + customfieldId+ '"]', variantElement);
                    if(attachmentClickElem) {
                        var attachmentClickLabel = $D.get('[data-zs-attachment-label]', attachmentClickElem);
                        if(attachmentClickLabel) {
                            attachmentClickLabel.innerText = i18n.get("product.custom_field.attachment.change_file");
                        }
                    }

                    var nameContainer = $D.get('[data-zs-attachment-name-container="'+ customfieldId +'"]', variantElement);
                    if(nameContainer) {
                        var fileName = $D.get('[data-attachment-file-name]', nameContainer);
                        if(fileName) {
                            fileName.innerText = "";
                        }

                        nameContainer.style.display = "none";
                    }

                }

            }

			else {
          field.value = fieldValue;
      }
  });

}
function closeSuccessMessage() {
	var cartAddSuccess = document.querySelectorAll('[data-cart-add-success="theme-cart-add-success"]')[0];
	if(cartAddSuccess){
		addClass(cartAddSuccess,'theme-cart-added-success-remove');
		removeClass(cartAddSuccess,'theme-cart-added-success');
	}
}
function closemessage(){
		var cartAddSuccess = document.querySelectorAll('[data-cart-add-success="theme-cart-add-success"]')[0];
		var cartFailure = document.querySelectorAll('[data-cart-add-failure="theme-cart-add-failure"]')[0];
		if(cartFailure){
			addClass(cartFailure,'theme-cart-failure-remove');
			removeClass(cartFailure,'theme-cart-failure');
		}
		if(cartAddSuccess){
			addClass(cartAddSuccess,'theme-cart-success-remove');
			removeClass(cartAddSuccess,'theme-cart-success');
			addClass(cartAddSuccess,'theme-cart-added-success-remove');
		}
		closeProductQuickLook();
}
function resetSelect(targetContainer){
	var VariantRadio = targetContainer.querySelectorAll('[data-zs-attribute-option]');
	var VariantSelect = targetContainer.querySelectorAll('[data-zs-attribute-select]');
	if(VariantSelect){
		for(vs=0;vs<VariantSelect.length;vs++){
			VariantSelect[vs].selectedIndex = 0;
		}
	}
	if(VariantRadio){
		for(vs=0;vs<VariantRadio.length;vs++){
			VariantRadio[vs].checked = false;
			removeClass(VariantRadio[vs].parentElement,'chekedLabel');
		}
	}
	if(typeof product_option != "undefined"){
		if(VariantSelect.length!=0 || VariantRadio.length!=0) {
			var productId = (targetContainer != document) ? targetContainer.getAttribute("data-zs-product-id") : "";
			_hideCustomFieldsOfVariants(productId);
			product_option.resetAddToCart(productId,targetContainer);
		}
	}
	var allStocks = targetContainer.querySelectorAll("[data-variant-id-stock]");
	for(sa=0;sa<allStocks.length;sa++){
		allStocks[sa].style.display = 'none';
	}
	var dataResetQuantity = targetContainer.querySelectorAll("[data-theme-quantity]");
	for(qr=0;qr<dataResetQuantity.length;qr++){
		dataResetQuantity[qr].value = 1 ;
	}
}

var deliveryLocationLoader,deliveryLocationPinInput,deliveryLocationPinError;

function deliveryLocationPinValidate(inputEl,pinErrorMsg){
	if(inputEl && pinErrorMsg){
		var inpPattern = /[^0-9a-zA-Z?*-]+/;
		inputEl.addEventListener('keyup',function(){
			var isPattern = inpPattern.test(this.value);
			pinErrorMsg.innerText = i18n.get('delivery_location_availability.label.error.invalid.postal_code');
			isPattern ? pinErrorMsg.style.display = "block" : pinErrorMsg.style.display ="none"
		});
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	resetSelect(document);

	deliveryLocationLoader = document.querySelector('[data-theme-delivery-location-loader]');

	deliveryLocationPinInput = document.querySelector('[data-zs-delivery-location-postalcode]');
	deliveryLocationPinError = document.querySelector('[data-zs-delivery-availability-product-details-error-message]');
	deliveryLocationPinValidate(deliveryLocationPinInput,deliveryLocationPinError);


	var loader = $D.get('[data-theme-loader]');
	var body = document.getElementsByTagName("body")[0];
	var contentContainer = $D.get('[data-theme-content-container]');
	if(contentContainer){
		var contentParent = contentContainer.parentElement;
	}
	if(window.location.href.indexOf("search-products") > -1){
		addClass(contentContainer,'theme-search-page-contianer')
	}
	if(!loader && window.location.href.indexOf("search-products") > -1){
      var tempLoad = document.createElement('div');
      addClass(tempLoad,'theme-loader');
      addClass(tempLoad,'theme-loader-show');
      tempLoad.style.position = "static";
      tempLoad.style.marginTop = '80px';
      tempLoad.setAttribute('data-theme-temp-load','');
      tempLoad.innerHTML = i18n.get("search.wait.message")+' . . .';
			if(contentParent){
      	contentParent.insertBefore(tempLoad,contentContainer);
			}
			else{
				contentContainer.insertBefore(tempLoad,contentContainer);
			}
      var offsetVal = window.pageYOffset;
      var mainHeader = $D.get('[data-headercontainer]');
			var headerSix = mainHeader.classList.contains('zpheader-style-06');
      var mobileHeaderFix = mainHeader.classList.contains('theme-mobile-header-fixed');
			var verticalHeader = $D.get('[data-theme-header-six-res]');
			if(verticalHeader){
				var verticalHeaderHeight = verticalHeader.clientHeight;
			}
      if(mainHeader){
          var mainHeaderHeight = mainHeader.clientHeight;
      }
			if(headerSix && mainHeader && tempLoad && (contentContainer.parentNode.nodeName == 'BODY')){
				addClass(tempLoad,'theme-temp-load-padding');
			}
  }
});
function addToCartFailure (e) {
	var cartAddFailure = document.querySelectorAll('[data-cart-add-failure="theme-cart-add-failure"]')[0];
	var cartMsgFour = document.querySelectorAll('[data-theme-message-four]')[0];
	var quickLookContainer = document.getElementById("product_quick_look");
	addClass(cartAddFailure,'theme-cart-failure');
	removeClass(cartAddFailure,'theme-cart-failure-remove');
	if(cartMsgFour){
		addClass(cartAddFailure,'theme-cart-added-failure');
		removeClass(cartAddFailure,'theme-cart-added-failure-remove');
	}
	if(quickLookContainer && cartMsgFour){
		closeProductQuickLook();
	}
	var addcartButton = e.detail.target;
	removeClass(addcartButton,'theme-cart-loading-container');
	var cartButtonText = addcartButton.querySelectorAll('[data-theme-cart-button-text="theme-cart-button-text"]')[0];
	var cartButtonLoading = addcartButton.querySelectorAll('[data-theme-cart-button-loading="theme-cart-button-loading"]')[0];
	var cartButtonLoadingFive = addcartButton.querySelectorAll('[data-theme-cart-button-loading-five="theme-cart-button-loading-five"]')[0];
	var cartLoadingTwo = addcartButton.querySelectorAll('[data-theme-cart-button-icon="data-theme-cart-button-icon"]')[0];
	var cartResponse = (e.detail.response.cart_details != null) ? e.detail.response.cart_details.message : e.detail.response.error.message;
	var cartFailureDetail = document.querySelectorAll('[data-theme-failure-reason="theme-failure-reason"]')[0];
  cartFailureDetail.innerHTML = cartResponse;

	if(cartButtonText){
		cartButtonText.style.display = "block";
	}
	if(cartLoadingTwo){
		cartLoadingTwo.style.display = "block";
	}
	if(cartButtonLoading){
		cartButtonLoading.style.display = "none";
	}
	if(cartButtonLoadingFive){
		cartButtonLoadingFive.style.display = "none";
	}
}
function closeFailureMessage() {
	var cartAddFailure = document.querySelectorAll('[data-cart-add-failure="theme-cart-add-failure"]')[0];
	if(cartAddFailure){
		addClass(cartAddFailure,'theme-cart-failure-added-remove');
		removeClass(cartAddFailure,'theme-cart-added-failure');
	}
}
function updateToCartSuccess (e) {
	var cartupdateloading = document.querySelector("[data-theme-loader]");
	var cartUpdateSuccess = document.querySelectorAll('[data-cart-update-success="theme-cart-update-success"]')[0];
	var cartMsgFour = document.querySelectorAll('[data-theme-message-four]')[0];
	var cartNameContainer = document.querySelectorAll('[data-cart-update-success-product-name="theme-cart-update-success-product-name"]')[0];
	var updateCartButton = e.detail.target;
	if(updateCartButton.hasAttribute("data-zs-update")){
	removeClass(updateCartButton,'theme-cart-updating');
	}else if(cartupdateloading){
		hideLoader()
	}
	addClass(cartUpdateSuccess,'theme-cart-success');
	removeClass(cartUpdateSuccess,'theme-cart-success-remove');
	if(cartMsgFour){
		addClass(cartUpdateSuccess,'theme-cart-page-success');
		removeClass(cartUpdateSuccess,'theme-cart-page-success-remove');
	}
	var errorflagId = e.detail.target.getAttribute('data-zs-product-variant-id');
  var errorContainerCart = document.querySelectorAll('[data-quantity-error-cart="'+errorflagId+'"]')[0];
  errorContainerCart.style.display = 'none';

	setTimeout(function() {
		addClass(cartUpdateSuccess,'theme-cart-success-remove');
		removeClass(cartUpdateSuccess,'theme-cart-success');
		if(cartMsgFour){
			removeClass(cartUpdateSuccess,'theme-cart-page-success');
			addClass(cartUpdateSuccess,'theme-cart-page-success-remove');
		}
	}, 3000);

	var detail = e.detail;
	var variantId = detail.target.getAttribute("data-zs-product-variant-id");
	var lineItems = detail.cart.line_items;

	var currentLineItem;

	for (var lineItem of lineItems) {
		if (lineItem.item_id == variantId) {
			currentLineItem = lineItem;
			break;
		}
	}

	if(cartNameContainer){
		cartNameContainer.innerHTML = currentLineItem.name;
	}
}
function showUpdate(cartitem){
	var updateButton =  document.querySelectorAll('[data-theme-update="'+cartitem+'"]')[0];
	updateButton.style.display = 'block';
}
function updateToCartFailure (e) {
	var cartupdateloading = document.querySelector("[data-theme-loader]");
	var cartUpdateFailure = document.querySelectorAll('[data-cart-update-failure="theme-cart-update-failure"]')[0];
	var cartMsgFour = document.querySelectorAll('[data-theme-message-four]')[0];
	var updateCartButton = e.detail.target;

	var cartResponse = (e.detail.response.cart_details != null) ? e.detail.response.cart_details.message : e.detail.response.error.message;
	var cartFailureDetail = document.querySelectorAll('[data-theme-update-failure-reason="theme-update-failure-reason"]')[0];
  cartFailureDetail.innerHTML = cartResponse;

  if(updateCartButton.hasAttribute("data-zs-update")){
	removeClass(updateCartButton,'theme-cart-updating');
  }else if(cartupdateloading){
	  hideLoader()
  }
	addClass(cartUpdateFailure,'theme-cart-failure');
	removeClass(cartUpdateFailure,'theme-cart-failure-remove');

	if(cartMsgFour){
		addClass(cartUpdateFailure,'theme-cart-page-failure');
		removeClass(cartUpdateFailure,'theme-cart-page-failure-remove');
	}
	setTimeout(function() {
		addClass(cartUpdateFailure,'theme-cart-failure-remove');
		removeClass(cartUpdateFailure,'theme-cart-failure')
		if(cartMsgFour){
			removeClass(cartUpdateFailure,'theme-cart-page-failure');
			addClass(cartUpdateFailure,'theme-cart-page-failure-remove');
		}
	}, 3000);
	if(updateCartButton.hasAttribute("data-zs-update")){
		updateCartButton.style.display = 'block';
	}
}

function deleteFromCartSuccess (e) {
	var cartDeleteSuccess = document.querySelectorAll('[data-cart-delete-success="theme-cart-delete-success"]')[0];
	var cartMsgFour = document.querySelectorAll('[data-theme-message-four]')[0];
	addClass(cartDeleteSuccess,'theme-cart-success');
	removeClass(cartDeleteSuccess,'theme-cart-success-remove');
	if(cartMsgFour){
		addClass(cartDeleteSuccess,'theme-cart-page-success');
		removeClass(cartDeleteSuccess,'theme-cart-page-success-remove');
	}
	var deleteButtonElem = e.detail.target;
	removeClass(deleteButtonElem,'theme-cart-item-removing');
	setTimeout(function() {
		addClass(cartDeleteSuccess,'theme-cart-success-remove');
		removeClass(cartDeleteSuccess,'theme-cart-success');
		if(cartMsgFour){
			removeClass(cartDeleteSuccess,'theme-cart-page-success');
			addClass(cartDeleteSuccess,'theme-cart-page-success-remove');
		}
	}, 3000);
	var lineItemCount = parseInt(document.querySelectorAll('[data-zs-view-cart-count]')[0].textContent);
	var cartTableHead = document.querySelectorAll('[data-cart-table]');
	var cartNotEmptyMessage = document.querySelectorAll('[data-zs-cart-empty-message]');
	var cartEmptyShoppingButton = document.querySelectorAll('[data-cart-empty-shopping-button]');
	var cartEmptyCheckoutButton = document.querySelectorAll('[data-cart-empty-checkout-button]');
	var cartEmptyContinueLink = document.querySelectorAll('[data-zs-continue-shopping]');
	// NON DELIVERABLE PRODUCT LIST

	var commonNonDeliCont = document.querySelector('[data-zs-cart-delivery-availability-common-error-message]');
	var nonDeliverProdListCont = document.querySelector('[data-zs-cart-non-deliverable-items]');
	var deletedProdId = deleteButtonElem.getAttribute('data-zs-product-variant-id');
	if(nonDeliverProdListCont){
		var deletedNonDeliProd = nonDeliverProdListCont.querySelector('[data-zs-delivery-availability-cart-item-id="'+deletedProdId+'"]');
		var nonDeliverProdList = nonDeliverProdListCont.children;
	}
	if(deletedNonDeliProd){
		deletedNonDeliProd.remove();
	}
	if(commonNonDeliCont && nonDeliverProdList && nonDeliverProdList.length == 0){
		commonNonDeliCont.style.display = 'none';
		var checkout_button = cartEmptyCheckoutButton[0].querySelector("[data-zs-checkout]");
		if(checkout_button){
			checkout_button.removeAttribute("disabled");
		}
	}

	if (lineItemCount == 0) {
		addClass(cartTableHead[0],'theme-cart-empty');
		removeClass(cartNotEmptyMessage[0],'theme-cart-error-message-not-empty');
		addClass(cartNotEmptyMessage[0],'theme-cart-error-empty-message');
		addClass(cartEmptyShoppingButton[0],'theme-cart-empty-shopping-button');
		addClass(cartEmptyCheckoutButton[0],'theme-cart-empty-checkout-buton');
		addClass(cartEmptyContinueLink[0],'theme-continue-link');
		if(commonNonDeliCont){
			commonNonDeliCont.style.display = 'none';
		}
	}
}

function deleteFromCartFailure (e) {
	var cartDeleteFailure = document.querySelectorAll('[data-cart-delete-failure="theme-cart-delete-failure"]')[0];
	var cartMsgFour = document.querySelectorAll('[data-theme-message-four]')[0];
	var cartResponse = (e.detail.response.cart_details != null) ? e.detail.response.cart_details.message : e.detail.response.error.message;
	var cartFailureDetail = document.querySelectorAll('[data-theme-delete-failure-reason="theme-delete-failure-reason"]')[0];
  cartFailureDetail.innerHTML = cartResponse;

	addClass(cartDeleteFailure,'theme-cart-failure');
	removeClass(cartDeleteFailure,'theme-cart-failure-remove');
	if(cartMsgFour){
		addClass(cartDeleteFailure,'theme-cart-page-failure');
		removeClass(cartDeleteFailure,'theme-cart-page-failure-remove');
	}
	var deleteButtonElem = e.detail.target;
	removeClass(deleteButtonElem,'theme-cart-item-removing');
	setTimeout(function() {
		addClass(cartDeleteFailure,'theme-cart-failure-remove');
		removeClass(cartDeleteFailure,'theme-cart-failure');
		if(cartMsgFour){
			removeClass(cartDeleteFailure,'theme-cart-page-failure');
			addClass(cartDeleteFailure,'theme-cart-page-failure-remove');
		}
	}, 3000);
}

function addToCartWithInvalidVariant (e) {

	var targetContainer = getTargetContainer(e.detail.target);

	var prodId = (targetContainer && targetContainer != "") ? targetContainer.getAttribute("data-zs-product-id") : "";

	var quickViewScroll = document.querySelector("[data-theme-quickview-scroll]");

	var attributes = targetContainer.querySelectorAll("[data-zs-attribute-select]");
	attributesLength = attributes.length;

	for (atr=0;atr<attributesLength;atr++) {

		var attribute = attributes[atr];
		var attributeTagName = attribute.tagName;

		var errorAttr = targetContainer.querySelectorAll("[data-error-select-flag='" + prodId + "']");

		var errorAttrVal = attribute.getAttribute("data-zs-attribute-name");
		var errorContainer = targetContainer.querySelector('[data-variant-error="theme-data-error-'+errorAttrVal+'"]');

		if(errorContainer){
			errorContainer.style.display = "none";
		}

		if (attribute.selectedIndex === 0 && attributeTagName == 'SELECT') {
			errorContainer.style.display = "block";
		}

		if(attributeTagName != 'SELECT'){
			var radioSelect = attribute.querySelectorAll('[data-zs-attribute-option]');
			radioSelectLength = radioSelect.length;
			for(rs=0;rs<radioSelectLength;rs++){
				radioSelected = radioSelect[rs].checked;
				if(radioSelected){
					errorContainer.style.display = "none";
					break;
				}
			}
			if(!radioSelected){
				errorContainer.style.display = "block";
			}
		}

	}
	var errorContainerCommon = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-'+prodId+'"]')[0];
	if(errorContainerCommon){
		errorContainerCommon.className = ' theme-variant-select-error';
		errorContainerCommon.style.display = 'flex';
		errorContainerCommon.innerHTML = i18n.get("product.message.error.select_variant");
	}
	if(quickViewScroll){
		quickViewScroll.scrollTop = quickViewScroll.scrollHeight;
	}

}

function invalidProductQuantity (e) {

	// INVALID IN ADD TO CART

	var targetContainer = getTargetContainer(e.detail.quantityElement);

	var prodId = (targetContainer && targetContainer != "") ? targetContainer.getAttribute("data-zs-product-id") : "";

	if(e.detail.view != 'cart'){
		var errorContainer = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-'+prodId+'"]')[0];
		var errorContainerList = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-list-'+prodId+'"]')[0];
		if(errorContainer){
			errorContainer.style.display = "block";
			errorContainer.className = ' theme-variant-select-error';
			errorContainer.innerHTML = i18n.get("product.message.error.invalid_quantity");
		}
		if(errorContainerList){
			errorContainerList.style.display = 'block';
			errorContainerList.style.width = '100%';
			errorContainerList.className = ' theme-variant-select-error';
			errorContainerList.innerHTML = i18n.get("product.message.error.invalid_quantity");
			if(errorContainer){
				errorContainer.style.display = "none";
			}
		}
	}

	if(e.detail.view == 'cart'){
    var errorFlagInput = e.detail.quantityElement;
    errorFlagInputId = errorFlagInput.getAttribute('data-zs-product-variant-id');
    var errorContainerCart = document.querySelectorAll('[data-quantity-error-cart="'+errorFlagInputId+'"]')[0];
    errorContainerCart.style.display = 'block';
  }

	var cartButtonText = document.querySelectorAll('[data-theme-cart-button-text="theme-cart-button-text"]');
	var cartButtonLoading = document.querySelectorAll('[data-theme-cart-button-loading="theme-cart-button-loading"]');
  cartButtonTextLength = cartButtonText.length;
  cartButtonLoadingLength = cartButtonLoading.length;
  for(ct=0;ct<cartButtonTextLength;ct++){
		cartButtonText[ct].style.display = "block";
   }
  for(cl = 0;cl<cartButtonLoadingLength;cl++){
		cartButtonLoading[cl].style.display = "none";
  }

}

function selectAttribute (e) {

	var targetContainer = getTargetContainer(e.detail.target);

	var productId = (targetContainer && targetContainer != "") ? targetContainer.getAttribute("data-zs-product-id") : "";

	var errorContainer = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-'+productId+'"]')[0];


	var stockCartAttribute = targetContainer.querySelectorAll('[data-nostock-cart-add="theme-nostock-cart-add"]');
	stockCartAttributeLength = stockCartAttribute.length;

	for(sa=0;sa<stockCartAttributeLength;sa++){
		var stockCartAttributeDisplay = stockCartAttribute[sa].style.display;
		if(stockCartAttributeDisplay == 'none'){

			addClass(errorContainer,'theme-error-no-cart-button');
		}
		else{

			removeClass(errorContainer,'theme-error-no-cart-button');
		}
	}

	errorContainer.style.display = 'none';
	errorContainer.innerHTML = "";


	var attributes = targetContainer.querySelectorAll("[data-zs-attribute-select]");
	attributesLength = attributes.length;

	for (atr=0;atr<attributesLength;atr++) {


		var attributeTagName = attributes[atr].tagName;

		var attribute = attributes[atr];

		var errorAttrVal = attribute.getAttribute("data-zs-attribute-name");
		var errorVariantContainer = targetContainer.querySelector('[data-variant-error="theme-data-error-'+errorAttrVal+'"]');



		if (attributes[atr].selectedIndex != 0 && attributeTagName == 'SELECT') {
			errorVariantContainer.style.display = "none";
		}
		if(attributeTagName != 'SELECT'){
			var radioSelect = attributes[atr].querySelectorAll('[data-zs-attribute-option]');
			radioSelectLength = radioSelect.length;
			for(rs=0;rs<radioSelectLength;rs++){
				radioSelected = radioSelect[rs].checked;
				if(radioSelected){
					errorVariantContainer.style.display = "none";
				}
			}
		}
		// SHOW ADD CART BUTTON IF NO STOCK INFO

		if(attributeTagName == 'SELECT'){
			var stockCartAttribute = document.querySelectorAll('[data-nostock-cart-add="theme-nostock-cart-add"]');
			var noStockQuantity = document.querySelectorAll("[data-nostock-quantity]");
			if (attributes[atr].selectedIndex == 0) {
				for (sa=0;sa<stockCartAttribute.length;sa++){
					stockCartAttribute[sa].style.display = 'flex';
				}
				for (sq=0;sq<noStockQuantity.length;sq++){
					noStockQuantity[sq].style.display = 'flex';
				}
			}
		}
	}
}

function invalidAttributeGroup (e) {

	var targetContainer = getTargetContainer(e.detail.target);

	var selectedOption = e.detail.selectedOption;
  var selectedOptionLabel = selectedOption.parentElement;
  if(selectedOption.tagName != 'OPTION'){
 	 removeClass(selectedOptionLabel,'chekedLabel');
  }

	var prodId = (targetContainer && targetContainer != "") ? targetContainer.getAttribute("data-zs-product-id") : "";
	var errorContainer = targetContainer.querySelectorAll('[data-theme-error="theme-error-message-'+prodId+'"]')[0];

	errorContainer.className = ' theme-variant-select-error';
	errorContainer.style.display = 'inline-block';
	errorContainer.innerHTML = i18n.get("product.message.error.selected_invalid_group");

	// REMOVE FLOATER EFFECT OF ERROR MESSAGE IF CART BUTTON HIDDEN

	var stockCartAttribute = document.querySelectorAll('[data-nostock-cart-add="theme-nostock-cart-add"]');
	stockCartAttributeLength = stockCartAttribute.length;
	for(sa=0;sa<stockCartAttributeLength;sa++){
		var stockCartAttributeDisplay = stockCartAttribute[sa].style.display;
		if(stockCartAttributeDisplay == 'none'){
			addClass(errorContainer,'theme-error-no-cart-button');
		}
		else{
			removeClass(errorContainer,'theme-error-no-cart-button');
		}
	}

	// REMOVE FLOATER EFFECT OF ERROR MESSAGE IF CART BUTTON HIDDEN END

}

function addToCartLoading (e) {
	var addcartButton = e.detail.target;
	addClass(addcartButton,'theme-cart-loading-container');
	var cartButtonText = addcartButton.querySelectorAll('[data-theme-cart-button-text="theme-cart-button-text"]')[0];
	var cartButtonLoading = addcartButton.querySelectorAll('[data-theme-cart-button-loading="theme-cart-button-loading"]')[0];
	var cartButtonLoadingFive = addcartButton.querySelectorAll('[data-theme-cart-button-loading-five="theme-cart-button-loading-five"]')[0];
	var cartLoadingTwo = addcartButton.querySelectorAll('[data-theme-cart-button-icon="data-theme-cart-button-icon"]')[0];
	if(cartButtonText){
		cartButtonText.style.display = "none";
	}
	if(cartButtonLoading){
		cartButtonLoading.style.display = "block";
	}
	if(cartButtonLoadingFive){
		cartButtonLoadingFive.style.display = "flex";
	}
	if(cartLoadingTwo){
		cartLoadingTwo.style.display = "none";
	}
}
function updateToCartLoading (e) {
	var updateCartButton = e.detail.target;
	var cartupdateloading = document.querySelector("[data-theme-loader]");
	if(updateCartButton.hasAttribute("data-zs-update")){
		addClass(updateCartButton,'theme-cart-updating');
		updateCartButton.style.display = 'none';
	}else if(cartupdateloading){
		showLoader()
	}
}

function deleteFromCartLoading (e) {
	var deleteButtonElem = e.detail.target;
	addClass(deleteButtonElem,'theme-cart-item-removing');
}

function imageOrder (e){
	var imageIds = e.detail.image_ids;

	prodId = e.detail.productId;
	var thumbanailcontainer = document.querySelectorAll('[data-theme-thumbnail-container="theme-thumbnail-container-'+prodId+'"]')[0];
	if(thumbanailcontainer){
		var allImages = thumbanailcontainer.querySelectorAll("[data-zs-image-id]");
	}
	var first = true;
	var imageIdLength;
	if(imageIds.indexOf('-1') >= 0 ){
    	imageIdLength = imageIds.length - 1;
	}
  else{
		imageIdLength = imageIds.length;
  }
	if(imageIdLength == 1){
		if(thumbanailcontainer){
    		thumbanailcontainer.style.display = 'none';
		}
  }
  else{
		if(thumbanailcontainer){
  		thumbanailcontainer.style.display = 'flex';
		}
  }
	if(thumbanailcontainer){
		for (var i = 0; i < allImages.length; i++) {
				var image = allImages[i];
				var imageId = image.getAttribute("data-zs-image-id");
				var previousDisplay = image.style.display;
				if (previousDisplay !== "none") {
						image.setAttribute("data-show-display", image.style.display);
				}
				image.style.display = "none";
				addClass(image,'hb-grid-hide');
				if (imageIds.indexOf(imageId) > -1) {
						image.style.display = image.getAttribute("data-show-display");
						if (first) {
								image.querySelector("img").click();
								first = false;
						}
						removeClass(image,'hb-grid-hide');
				}
				if(imageIds.length == 0 || (imageIds.length == 1 && imageIds[0] == "-1")){
					image.style.display = "flex";
					removeClass(image,'hb-grid-hide');
				}
		}
	}
}

function selectedVariant(e){
	var currentStock = e.detail.variant_id;
	var currentElementId = e.detail.productId;
	var allStocks = document.querySelectorAll("[data-variant-id-stock]");
	var stockCartAttribute = document.querySelectorAll('[data-nostock-cart-add="theme-nostock-cart-add"]');
	var noStockQuantity = document.querySelectorAll("[data-nostock-quantity]");
	_hideCustomFieldsOfVariants(e.detail.productId);
	_displayCustomFieldOfVariant(currentStock, e.detail.productId);
	for(var i=0; i < allStocks.length; i++){
		stocks = allStocks[i];
		stock = stocks.getAttribute("data-variant-id-stock");
		stocks.style.display = 'none';
		if(stock == currentStock){

			var stockAvail = stocks.getAttribute('data-stock-avail');
			if(stockAvail == 'true'){
				stocks.style.display = "inline-block";
				for (sa=0;sa<stockCartAttribute.length;sa++){
					stockCartAttribute[sa].style.display = 'none';
				}
				for(sq=0;sq<noStockQuantity.length;sq++){
					noStockQuantity[sq].style.display = 'none';
				}
				addClass(stocks,'theme-out-of-stock');
			}
			else{
				stocks.style.display = "none";
				for (sa=0;sa<stockCartAttribute.length;sa++){
					stockCartAttribute[sa].style.display = 'flex';
				}
				for(sq=0;sq<noStockQuantity.length;sq++){
					noStockQuantity[sq].style.display = 'flex';
				}
				removeClass(stocks,'theme-out-of-stock');
			}
		}
	}

	// REMOVE CUSTOM FIELD ERRORS WHEN CLICK THE VARIANTS

	var variantContainer = $D.get('[data-variant-id="'+ currentStock +'"]');
	if(variantContainer){
		var targetContainer = getTargetContainer(variantContainer);
		if(targetContainer) {
			var customFields = $D.getAll('[data-custom-field-id]', targetContainer);
			customFields.forEach( function (field) {
					_removeErrorElement(field);
			});
		}
	}

	// END REMOVE CUSTOM FIELD ERRORS WHEN CLICK THE VARIANTS

	// Start - To update additional offers on variant change
		var currentContainer = $D.get('[data-zs-product-id="'+currentElementId+'"]');
		if(currentContainer){
			var additionalOfferContainer = currentContainer.querySelectorAll('[data-zs-pricelist-variantid]');
		    if(additionalOfferContainer){
	            for(i=0;i<additionalOfferContainer.length;i++){
					additionalOfferContainer[i].style.display = "none";
					additionalOfferContainer[i].classList.remove('theme-prod-pricelist-active');
				}
				var activeVariant = $D.get('[data-zs-pricelist-variantid ="' + e.detail.variant_id + '"]');
				if(e.detail.variant_id != -1 && activeVariant){
					activeVariant.style.display = "block";
					activeVariant.classList.add('theme-prod-pricelist-active');
				}
	        }
    	}
    // End - To update additional offers on variant change
}

function showMoreToggle (el,status) {
	var toggleContainer = document.querySelector('.theme-prod-pricelist-active .theme-prod-pricelist-morelist-outter');
	var toggleContent = document.querySelector('.theme-prod-pricelist-active .theme-prod-pricelist-morelist');
	if(status == 'show'){
		el.style.display = 'none';
		el.parentNode.querySelector('.theme-prod-pricelist-hide-btn').style.display = 'block';
		toggleContainer.style.height = toggleContent.clientHeight + "px";
	}else if(status == 'hide'){
		el.style.display = 'none';
		el.parentNode.querySelector('.theme-prod-pricelist-show-btn').style.display = 'block';
		toggleContainer.style.height = '0px';
	}
}

function multiCurrencyLoaded(e){
	var baseCurrency = document.querySelector('[data-theme-base-currency]');
	var currencyListContainer = document.querySelector('[data-theme-currency-list-ul]');
	var currencyListClick = document.querySelector('[data-theme-currency-list-container]');
	var currencyContainerHeight = document.querySelector('[data-theme-currency-list-container]');
	var currencyPlaceHeight = document.querySelector('[data-theme-currency-placeholder-non-res]');
	var curHeight = currencyListContainer.clientHeight;
	if(window.innerWidth > 992){
		if(curHeight != 0){
			currencyPlaceHeight.style.height = curHeight+'px';
			currencyContainerHeight.style.height = curHeight+'px';
		}
	}
	var targetCurrency = e.detail.currency_code;
	if(targetCurrency){
		currencyListContainer.insertBefore(targetCurrency,currencyListContainer.childNodes[0]);
	}
	else{
		if(baseCurrency){
			currencyListContainer.insertBefore(baseCurrency,currencyListContainer.childNodes[0]);
		}
	}
	currencyListClick.removeEventListener('click',openCurrency);
	currencyListClick.addEventListener('click',openCurrency);
  if(window.innerWidth < 992 ){
      currencyListContainer.addEventListener('click',function(){
          currencyListClick.removeEventListener('click',openCurrency);
      });
  }
}

function openCurrency(){
	var currencyList = document.querySelectorAll('[data-theme-currency-list]');
	var currencyListContainer = document.querySelector('[data-theme-currency-list-ul]');
	var currencyHideOverlay = document.querySelector('[data-theme-currency-hide-overlay]');
	var currencyHideMobile = document.querySelector('[data-theme-currency-hide-mobile]');
	var currencyMobileOpenTop = document.querySelector('[data-theme-currency-open-top]');
	var resMenu = document.querySelector('[data-non-res-menu="zptheme-menu-non-res"]');
	for(cur=0;cur<currencyList.length;cur++){
		if(currencyList[cur].style.display == 'flex'){
			currencyList[cur].style.display = 'none';
			currencyListContainer.firstChild.style.display = "flex";
			removeClass(currencyListContainer,'theme-currency-open');
			currencyHideOverlay.style.display = "none";
			removeClass(resMenu,'theme-change-zindex');
			currencyMobileOpenTop.style.display = "none";
		}
		else{
			currencyList[cur].style.display = 'flex';
			addClass(currencyListContainer,'theme-currency-open');
			currencyHideOverlay.style.display = "block";
			currencyHideMobile.style.display = "block";
			currencyMobileOpenTop.style.display = "flex";
			addClass(resMenu,'theme-change-zindex');
		}
	}
}

function resetMultiCurrency(e){
	var baseCurrency = document.querySelector('[data-theme-base-currency]');
	var currencyListContainer = document.querySelector('[data-theme-currency-list-ul]');
	var allCurrency = currencyListContainer.children;
	var targetCurrency = e.detail.currency_code;
	if(targetCurrency){
		currencyListContainer.insertBefore(targetCurrency,currencyListContainer.childNodes[0]);
	}
	else{
		if(baseCurrency){
			currencyListContainer.insertBefore(baseCurrency,currencyListContainer.childNodes[0]);
			for(ac=0;ac < allCurrency.length ; ac++){
      	allCurrency[ac].style.display = "none";
      }
			baseCurrency.style.display = "flex";
		}
	}
}

function _displayCustomFieldOfVariant(variantId, productId) {
    //display customn fields of appropriate variant
    var variantElements = $D.getAll('[data-variant-id="'+ variantId +'"]');
		var customFieldMainContainers = $D.getAll('[data-custom-field-main-container]');
		var customFieldQuickview = $D.get('[data-theme-custom-field-quickview]');
    variantElements.forEach(function(variant) {
        $D.css(variant, 'display', '');
    });

		customFieldMainContainers.forEach( function(customFieldMainContainer) {
			var targetContainer = productId ? customFieldMainContainer.closest('[data-zs-product-id="'+ productId +'"]') : customFieldMainContainer.closest('[data-zs-product-id]');
			if(targetContainer){
				$D.css(customFieldMainContainer, 'display', '');
			}
		});

		if(customFieldQuickview){
			$D.css(customFieldQuickview, 'padding-block-start', '29px');
		}
}

function _hideCustomFieldsOfVariants(productId) {
		var customFieldMainContainers = $D.getAll('[data-custom-field-main-container]');
		var customFieldQuickview = $D.get('[data-theme-custom-field-quickview]');
    $D.getAll('[data-variant-id]').forEach(function(variant) {
			 var targetContainer = productId ? variant.closest('[data-zs-product-id="'+ productId +'"]') : variant.closest('[data-zs-product-id]');
			 if(targetContainer) {
				 $D.css(variant, 'display', 'none');
			 }
    });

		customFieldMainContainers.forEach( function(customFieldMainContainer) {
			var targetContainer = productId ? customFieldMainContainer.closest('[data-zs-product-id="'+ productId +'"]') : customFieldMainContainer.closest('[data-zs-product-id]');
			if(targetContainer){
				$D.css(customFieldMainContainer, 'display', 'none');
			}
		});

		if(customFieldQuickview){
			$D.css(customFieldQuickview, 'padding-block-start', '0');
		}
}


function customFieldValidation(e) {
    var detail = e.detail;
    if(detail.custom_fields) {
    	detail.custom_fields.forEach( function (field) {
            _removeErrorElement(field);
        });
    }

	if(detail.error_custom_fields) {
    	detail.error_custom_fields.forEach( function (error, index) {
            var data = {
                element : error.field,
                message : error.message
            }
            if(index == 0) {
                data.scroll = true;
                data.scrollposition = "center";
				data.scrollViewElem = error.field.parentNode;
            }
            addErrorMsg(data);
        });
    }
}

function showSearchLoader(e){
  var resultTarget = e.detail.element;
  var mainHeader = $D.get('[data-headercontainer]');
  var mobileHeaderFix = mainHeader.classList.contains('theme-mobile-header-fixed');
	var searchButton = e.detail.submitElem;
	if(searchButton){
		var searchDots = searchButton.parentNode.querySelector('[data-theme-search-loader-dots]');
	}
	if(searchButton && searchDots){
		addClass(searchDots,'theme-show-search-loader-dots');
    searchButton.style.display = "none";
	}
	showLoader()
  if(resultTarget){
      addClass(resultTarget,'theme-searching-opacity');
  }
  if(mainHeader){
  	var mainHeaderHeight = mainHeader.clientHeight;
  }
}
function hideSearchLoader(e){
	var loader = $D.get('[data-theme-loader]');
  var tempLoad = $D.get('[data-theme-temp-load]');
	var searchButton = e.detail.submitElem;
	if(searchButton){
		var searchDots = searchButton.parentNode.querySelector('[data-theme-search-loader-dots]');
	}
	if(searchButton && searchDots){
		removeClass(searchDots,'theme-show-search-loader-dots');
          searchButton.style.display = "block";
	}
  if(tempLoad){
  	tempLoad.parentNode.removeChild(tempLoad);
  }
    var resultTarget = e.detail.element;
	hideLoader();
	if(resultTarget){
		removeClass(resultTarget,'theme-searching-opacity');
	}
	window.scrollTo({top:0, behaviour:'smooth'});
	mobileFilter();
}

function showLoader(){
	var loader = $D.get('[data-theme-loader]');
	var body = document.getElementsByTagName("body")[0];
	var offsetVal = window.pageYOffset;
	var header = $D.get('[data-header]');
	var mainHeader = $D.get('[data-headercontainer]');
	var headerAni = header.classList.contains('theme-header-animate');
	var headerSix = mainHeader.classList.contains('zpheader-style-06');
	if(loader){
		addClass(loader,'theme-loader-show');
		addClass(body,'theme-loader-body-hidden');
	}
	if(header){
		var headerHeight = header.clientHeight;
	}
	if(header && offsetVal > headerHeight && headerAni && !headerSix){
		loader.children[0].style.marginTop = (offsetVal+headerHeight)+'px';
	}
	  else if(mainHeader && headerSix){
		loader.children[0].style.marginTop = (offsetVal+80)+'px'
	}
}

function hideLoader(){
	var loader = $D.get('[data-theme-loader]');
	  var body = document.getElementsByTagName("body")[0];
	  if(loader){
		  removeClass(loader,'theme-loader-show');
		  removeClass(body,'theme-loader-body-hidden');
	  }
}

function uploadAttachmentCustomFieldsSuccess(e) {
    var data = e.detail;
    var attachment_element = e.detail.field;
    var variantElement = data.variant_element;

    var customfieldId = attachment_element.getAttribute("data-custom-field-id");

    attachment_element.setAttribute("data-value", data.document_id)

    var attachmentClickElem = $D.get('[data-zs-attachment-upload-custom-field-id="' + customfieldId+ '"]', variantElement);
    if(attachmentClickElem) {
        var attachmentClickLabel = $D.get('[data-zs-attachment-label]', attachmentClickElem);
        if(attachmentClickLabel) {
            attachmentClickLabel.innerText = i18n.get("product.custom_field.attachment.change_file");
        }
    }

    var nameContainer = $D.get('[data-zs-attachment-name-container="'+ customfieldId +'"]', variantElement);
    if(nameContainer) {
        var fileName = $D.get('[data-attachment-file-name]', nameContainer);
        if(fileName) {
            fileName.innerText = data.attachment_file_name;
        }

        $D.css(nameContainer, 'display', '');

        var remove = $D.get('[data-zs-remove-attachment]', nameContainer);
        remove.addEventListener("click", function(e) {
            attachment_element.setAttribute("data-value", "")
            $D.css(nameContainer, 'display', 'none');

            var attachmentClickLabel = $D.get('[data-zs-attachment-label]', attachmentClickElem);
            if(attachmentClickLabel) {
                attachmentClickLabel.innerText = i18n.get("product.custom_field.attachment.choose_file");
            }

        });

    }

    //remove attachment error element
    _removeErrorElement(attachment_element)
}

function elementLoader(e) {
    var targetElement = e.detail.element;
    var displayOption = e.detail.display;

    if(targetElement) {
        if(displayOption == "none") {
            targetElement.removeAttribute("disabled");
        } else {
            targetElement.setAttribute("disabled", true);

        }

        var svgElement = $D.getByTag('svg', targetElement)[0];
        if(svgElement) {
            $D.css(svgElement, 'display', displayOption);

        }
    }

}

// Delivery location popup loader

function showPopupLoader(e){
	if(deliveryLocationLoader){
		deliveryLocationLoader.style.display = 'flex';
	}
}
function hidePopupLoader(e){
	if(deliveryLocationLoader){
		deliveryLocationLoader.style.display = 'none';
	}
	deliveryLocationPinInput = document.querySelector('[data-theme-popup-postalcode]');
	deliveryLocationPinError = document.querySelector('[data-zs-delivery-availability-popup-error-message]');
	deliveryLocationPinValidate(deliveryLocationPinInput,deliveryLocationPinError);
}

document.addEventListener("zp-event-add-to-cart-success", addToCartSuccess, false);
document.addEventListener("zp-event-add-to-cart-failure", addToCartFailure, false);
document.addEventListener("zp-event-update-to-cart-success", updateToCartSuccess, false);
document.addEventListener("zp-event-update-to-cart-failure", updateToCartFailure, false);
document.addEventListener("zp-event-delete-from-cart-success", deleteFromCartSuccess, false);
document.addEventListener("zp-event-delete-from-cart-failure", deleteFromCartFailure, false);
document.addEventListener("zp-event-add-to-cart-invalid-variant", addToCartWithInvalidVariant, false);
document.addEventListener("zp-event-invalid-product-quantity", invalidProductQuantity, false);
document.addEventListener("zp-event-attribute-selected", selectAttribute, false);
document.addEventListener("zp-event-attribute-group-invalid", invalidAttributeGroup, false);

document.addEventListener("zp-event-add-to-cart-loading", addToCartLoading, false);
document.addEventListener("zp-event-update-to-cart-loading", updateToCartLoading, false);
document.addEventListener("zp-event-delete-from-cart-loading", deleteFromCartLoading, false);

document.addEventListener("zp-event-image-ordered", imageOrder, false);

document.addEventListener("zp-event-selected-variant", selectedVariant, false);

document.addEventListener("zp-event-multi-currency-loaded", multiCurrencyLoaded, false);

document.addEventListener("zp-event-multi-currency-value-reset", resetMultiCurrency, false);

document.addEventListener("zs-event-custom-field-validation-error", customFieldValidation, false);

document.addEventListener("zp-event-search-pending",showSearchLoader, false);

document.addEventListener("zp-event-search-success",hideSearchLoader, false);

document.addEventListener("zs-event-custom-field-attachment-success",uploadAttachmentCustomFieldsSuccess, false);
document.addEventListener("zs-event-button-loader",elementLoader, false);

document.addEventListener("zp-event-delivery-availability-popup-on-load",showPopupLoader, false);
document.addEventListener("zp-event-delivery-availability-popup-loaded",hidePopupLoader, false);
document.addEventListener("zp-event-check-delivery-availability-loading",showPopupLoader, false);
document.addEventListener("zp-event-check-delivery-availability-success",hidePopupLoader, false);
document.addEventListener("zp-event-check-delivery-availability-failure",hidePopupLoader, false);
