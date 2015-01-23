// JavaScript Document

var pictureSource; // picture source
var destinationType; // sets the format of returned value 
var encodingType;
var mediaType;

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	encodingType = navigator.camera.EncodingType;
	mediaType = navigator.camera.MediaType;
	
	setTimeout(function(){ navigator.splashscreen.hide(); }, 300);

}

			
$(document).ready(function(){
	
	var URLServer = "http://webapp.grouplive.net";
	
	$.extend($.mobile, {
        pageLoadErrorMessage: 'Erreur de chargement'
    });
	
	
	$(document).on('pagebeforeshow', function(e, data){
		chargementPage();
	});
	
	$(document).on('pageshow', function(e, data){
		chargementPageAfter();
	});
	
	$(window).on('orientationchange', function(e, data){
		centrerLogin();
	});
	
	chargementPage();
	
	// Centrer verticalement bloc connexion
	function centrerLogin(){
		if($("#page-login > .ui-content").length > 0 && $("#page-login > .ui-content").is(':visible')){
			//console.log('centrer' + $('#page-login > .ui-content').outerHeight());
			if(($(window).height() - $('#page-login > .ui-content').outerHeight())>0){
				$("#page-login > .ui-content").css({'margin-top': ($(window).height() - $('#page-login > .ui-content').outerHeight())/2});
			}
		}
	}
	centrerLogin();
			
	function chargementPage(){
		// .ui-content à 100% pour centrer background-image
		var screen = $.mobile.getScreenHeight();
		var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
		var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
		var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
		var content = screen - contentCurrent;
		//$(".ui-content").height(content);
		
		$('.popup-error').click(function(e) {
            $( this ).popup( "close" );
        });
		
		if($("#form-login").length > 0){
			
			if(window.localStorage.getItem("user_identifiant")){
				$("#form-login #identifiant").val(window.localStorage.getItem("user_identifiant"));
				$("#form-login #passwd").val(window.localStorage.getItem("user_mot_de_passe"));
				$("#form-login #memoriser-cnx").attr('checked',true).checkboxradio('refresh');
			}
			
			$("#form-login").unbind('submit').submit(function(form) {
				
				var data = {'identifiant': $("#form-login #identifiant").val(), 'passwd': $("#form-login #passwd").val()};
				$.ajax({
					type: 'post',
					url: URLServer + '/server/connexion.php',
					data: data,
					dataType: 'json',
					//contentType: false, //  si data = FormData
					//processData: false, // = false si data = FormData
					cache: false,
					success: function (response){
						//console.log(response);
						if(typeof response.error !== 'undefined'){
							alert(response.error.msg);
							if(response.error.code == 2){
								$(window).attr('location', 'index.html');	
							}
						}else if(typeof response.user !== 'undefined'){
							//alert(response.user.id);
							//popupError("popupError", "Connexion réussie.", "Succès", 1);
							// Si choix de mémoriser l'identifiant
							if($("#memoriser-cnx").is(':checked')){
								window.localStorage.setItem("user_identifiant", data.identifiant);
								window.localStorage.setItem("user_mot_de_passe", data.passwd);
							}else{
								window.localStorage.removeItem("user_identifiant");
								window.localStorage.removeItem("user_mot_de_passe");
							}
							window.sessionStorage.setItem("user_id", response.user.id);
							window.sessionStorage.setItem("user_sess_id", response.user.sess_id);
							$.mobile.changePage('home.html', {});
							//window.sessionStorage.removeItem(timestamp);
						}else{
							popupError("popupError", "Identifiants incorrects.");
						}
					},
					error: function (response){
						popupError("popupError", "Erreur accès réseau");
					}
				});
				
				//alert('Identifiants incorrect');
				return false;
			});
		}
		
		if($.mobile.activePage[0].id == "page-publier"){
			
			$("#page-publier .image-upload-selection label").click(function(e) {
				// Prend une image dans la galerie photo
				var self = $(this);
				navigator.camera.getPicture(function(imageURI){
						var blocApercu = self.parents(".onglet").find(".upload-apercu");
						blocApercu.empty();
						blocApercu.append('<img src="">');
						blocApercu.find('img').attr('src', imageURI);
						
						self.parents(".onglet").find("input.champ-photo").val(imageURI);
						
						blocApercu.append('<br><a href="" class="selection-sup-photo"></a>');
						blocApercu.find("a.selection-sup-photo").on( 'click', function(){
							blocApercu.empty();
							self.parents(".onglet").find("input.champ-photo").val('');
							
							return false;
						} );
						//window.resolveLocalFileSystemURI($('#form-actu input#champ-photo').val(), resolveOnSuccess, null);
						
					}, null, { quality: 50,
					destinationType: destinationType.FILE_URI,
					sourceType: pictureSource.PHOTOLIBRARY,
					encodingType: encodingType.JPEG,
					mediaType: mediaType.PICTURE
				});
            });
				
			$("#page-publier .image-upload-camera label").click(function(e) {
				// Prend une image avec l'appareil photo
				var self = $(this);
				navigator.camera.getPicture(function(imageURI){
						var blocApercu = self.parents(".onglet").find(".upload-apercu");
						blocApercu.empty();
						blocApercu.append('<img src="">');
						blocApercu.find('img').attr('src', imageURI);
						
						self.parents(".onglet").find("input.champ-photo").val(imageURI);
						
						blocApercu.append('<br><a href="" class="selection-sup-photo"></a>');
						blocApercu.find("a.selection-sup-photo").on( 'click', function(){
							blocApercu.empty();
							self.parents(".onglet").find("input.champ-photo").val('');
							
							return false;
						} );
						//window.resolveLocalFileSystemURI($('#form-actu input#champ-photo').val(), resolveOnSuccess, null);
						
					}, null, { quality: 50,
					destinationType: destinationType.FILE_URI,
					encodingType: encodingType.JPEG
				});
            });
			
		}
		
		// Publier une actualité
		if($("#form-actu").length > 0){
		
			/*function resolveOnSuccessActu(entry) {
				entry.file( function(file) {
					var reader = new FileReader();
					reader.onloadend = function(evt) {
						var data = new FormData();
						data.append('id_user', window.sessionStorage.getItem("user_id"));
						data.append('sess_id', window.sessionStorage.getItem("user_sess_id"));
						data.append('titre', $("#form-actu #titre").val());
						data.append('description', $("#form-actu #description").val());
						data.append('type', 0); // Type actu
						
						//alert(evt.target.result);
						//data.append('photo', evt.target.result, "photo.jpg");
						data.append('photo', new Blob([evt.target.result],{"type":file.type}), "photo.jpg");
						
						sendFormActu(data);
					};
					reader.readAsArrayBuffer( file );
				}, null );
			}*/
			
			function supDonneesActu(){
				$("#form-actu #titre").val('');
				$("#form-actu #description").val('');
				$('#form-actu input#champ-photo').val('');
				$("#form-actu .upload-apercu").empty();
			}
			
			function sendFormActu(data){
				$.mobile.loading( 'show', {
					text: 'Chargement en cours...',
					textVisible: true,
					theme: 'a',
					html: ""
				});
				
				$.ajax({
					type: 'post',
					url: URLServer + '/server/publier.php',
					data: data,
					dataType: 'json',
					contentType: false, //  si data = FormData
					processData: false, // = false si data = FormData
					cache: false,
					success: function (response){
						//console.log(response);
						$.mobile.loading( 'hide' );
						if(typeof response.error !== 'undefined'){
							alert(response.error.msg);
							if(response.error.code == 2){
								$(window).attr('location', 'index.html');	
							}
						}else if(typeof response.publier !== 'undefined'){
							//alert(response.user.id);
							supDonneesActu();
							popupError("popupError3", "Actualité publié.", "Succès", 1);
							//window.sessionStorage.removeItem(timestamp);
						}
					},
					error: function (response){
						$.mobile.loading( 'hide' );
						popupError("popupError3", "Erreur accès réseau");
					}
				});
			}
					
				
			$("#form-actu").unbind('submit').submit(function(form) {
						
				if($("#form-actu #titre").val() == ''){
					//$("#form-contact #nom").parent().addClass('error');
					popupError("popupError3", "Renseignez un titre");
					return false;
				}
				
				//var data = {'id_user': window.sessionStorage.getItem("user_id"), 'sess_id': window.sessionStorage.getItem("user_sess_id"), 'titre': $("#form-actu #titre").val(), 'description': $("#form-actu #description").val()};
				
				if($('#form-actu input#champ-photo').val()){
					var chp_photo = $('#form-actu input#champ-photo').val();
					
					//window.resolveLocalFileSystemURI(chp_photo, resolveOnSuccessActu, null);
					/*window.resolveLocalFileSystemURI(chp_photo, 
						function(entry){
							entry.file( function(file) {
								alert(chp_photo);
								alert(file.type);
								alert(file.name);
							}, null );
							
						}
						, null);*/
						
						
					$.mobile.loading( 'show', {
						text: 'Chargement en cours...',
						textVisible: true,
						theme: 'a',
						html: ""
					});
					
					//alert(chp_photo);
					var options = new FileUploadOptions();
					options.fileKey = "photo";
					options.fileName = "image" + Number(new Date()) + ".jpg"; //chp_photo.substr(chp_photo.lastIndexOf('/') + 1);
					options.mimeType = "image/jpeg";
										
					var params = {};
					params.id_user = window.sessionStorage.getItem("user_id");
					params.sess_id = window.sessionStorage.getItem("user_sess_id");
					params.titre = $("#form-actu #titre").val();
					params.description = $("#form-actu #description").val();
					params.type = 0;
					
					options.params = params;
					
					var ft = new FileTransfer();
					ft.upload(chp_photo, encodeURI(URLServer + '/server/publier.php'), function (r) {
						supDonneesActu();
						$.mobile.loading( 'hide' );
						popupError("popupError3", "Actualité publié.", "Succès", 1);
						//alert("Code = " + r.responseCode);
						//alert("Response = " + r.response);
						//alert("Sent = " + r.bytesSent);
					}
					, function (error) {
						$.mobile.loading( 'hide' );
						alert("An error has occurred: Code = " + error.code);
						//alert("upload error source " + error.source);
						//alert("upload error target " + error.target);
					}
					, options);

				
					/*if($('#form-actu #' + chp_photo)[0].files.length > 0){
						data.append('photo', $('#form-actu #' + chp_photo)[0].files[0]);
					}*/
				}else{
					var data = new FormData();
					data.append('id_user', window.sessionStorage.getItem("user_id"));
					data.append('sess_id', window.sessionStorage.getItem("user_sess_id"));
					data.append('titre', $("#form-actu #titre").val());
					data.append('description', $("#form-actu #description").val());
					data.append('type', 0); // Type actu
					
					sendFormActu(data);
				}
				/*if($('#form-actu #upload-camera')[0].files.length > 0){
					data.append('photo', $('#form-actu #upload-camera')[0].files[0]);
				}else if($('#form-actu #upload-selection')[0].files.length > 0){
					data.append('photo', $('#form-actu #upload-selection')[0].files[0]);
				}*/
				/*$.each($('#form-actu #upload-camera')[0].files, function(i, file) {
					data.append('photo[]', file);
				});*/
				
				return false;
				
			});
			
		}
		
		// Publier une galerie photo
		if($("#form-galerie").length > 0){
			
			function supDonneesGalerie(){
				$("#form-galerie #titre2").val('');
				$("#form-galerie #description2").val('');
				$('#form-galerie input#champ-photo2').val('');
				$("#form-galerie .upload-apercu").empty();
			}
			
			
			$("#form-galerie").unbind('submit').submit(function(form) {
				
				if($("#form-galerie #titre2").val() == ''){
					//$("#form-contact #nom").parent().addClass('error');
					popupError("popupError3", "Renseignez un titre");
					return false;
				}
				
				if($('#form-galerie input#champ-photo2').val()){
					
					var chp_photo = $('#form-galerie input#champ-photo2').val();
					
					$.mobile.loading( 'show', {
						text: 'Chargement en cours...',
						textVisible: true,
						theme: 'a',
						html: ""
					});
					
					//alert(chp_photo);
					var options = new FileUploadOptions();
					options.fileKey = "photo";
					options.fileName = "image" + Number(new Date()) + ".jpg";
					options.mimeType = "image/jpeg";
										
					var params = {};
					params.id_user = window.sessionStorage.getItem("user_id");
					params.sess_id = window.sessionStorage.getItem("user_sess_id");
					params.titre = $("#form-galerie #titre2").val();
					params.description = $("#form-galerie #description2").val();
					params.type = 1;
					
					options.params = params;
					
					var ft = new FileTransfer();
					ft.upload(chp_photo, encodeURI(URLServer + '/server/publier.php'), function (r) {
						supDonneesGalerie();
						$.mobile.loading( 'hide' );
						popupError("popupError3", "Galerie publiée.", "Succès", 1);
					}
					, function (error) {
						$.mobile.loading( 'hide' );
						alert("An error has occurred: Code = " + error.code);
					}
					, options);
					
				}else{
				
					var data = new FormData();
					data.append('id_user', window.sessionStorage.getItem("user_id"));
					data.append('sess_id', window.sessionStorage.getItem("user_sess_id"));
					data.append('titre', $("#form-galerie #titre2").val());
					data.append('description', $("#form-galerie #description2").val());
					data.append('type', 1);	// type galerie
											
					$.mobile.loading( 'show', {
						text: 'Chargement en cours...',
						textVisible: true,
						theme: 'a',
						html: ""
					});
					
					$.ajax({
						type: 'post',
						url: URLServer + '/server/publier.php',
						data: data,
						dataType: 'json',
						contentType: false, //  si data = FormData
						processData: false, // = false si data = FormData
						cache: false,
						success: function (response){
							//console.log(response);
							$.mobile.loading( 'hide' );
							if(typeof response.error !== 'undefined'){
								alert(response.error.msg);
								if(response.error.code == 2){
									$(window).attr('location', 'index.html');	
								}
							}else if(typeof response.publier !== 'undefined'){
								//alert(response.user.id);
								supDonneesGalerie();
								popupError("popupError3", "Galerie publiée.", "Succès", 1);
								//window.sessionStorage.removeItem(timestamp);
							}
						},
						error: function (response){
							$.mobile.loading( 'hide' );
							popupError("popupError3", "Erreur accès réseau");
						}
					});
				
				}
				
				//alert('Identifiants incorrect');
				return false;
			});
			
		}
		
		// Page Home Menus
		if($.mobile.activePage[0].id == "page-home"){
			
			var data = {'id_user': window.sessionStorage.getItem("user_id"), 'sess_id': window.sessionStorage.getItem("user_sess_id")};
			$.ajax({
				type: 'post',
				url: URLServer + '/server/site.php',
				data: data,
				dataType: 'json',
				cache: false,
				success: function (response){
					if(typeof response.error !== 'undefined'){
						alert(response.error.msg);
						if(response.error.code == 2){
							$(window).attr('location', 'index.html');	
						}
					}else if(typeof response.site !== 'undefined'){
						
						// Masque le menu publier si non activé
						if(response.site.acces_actualite == 0 && response.site.acces_galerie == 0){
							$("#page-home .menu-acc-bas a.menu-publier").hide();
							$("#page-home .menu-acc-bas a.menu-contact").css({'width': '100%'});
						}else{
							$("#page-home .menu-acc-bas a.menu-publier").show();
							$("#page-home .menu-acc-bas a.menu-contact").css({'width': '50%'});
						}
						
					}
				},
				error: function (response){
					//popupError("popupError3", "Erreur accès réseau");
				}
			});
		}
		
		// Page Contact
		if($("#form-contact").length > 0){
			
			$("#form-contact").unbind('submit').submit(function(form) {
				
				if($("#form-contact #nom").val() == ''){
					//$("#form-contact #nom").parent().addClass('error');
					popupError("popupError4", "Renseignez votre nom");
				}else if($("#form-contact #message").val() == ''){
					popupError("popupError4", "Renseignez votre message");
				}else{
					var data = {'id_user': window.sessionStorage.getItem("user_id"), 'sess_id': window.sessionStorage.getItem("user_sess_id"), 'nom': $("#form-contact #nom").val(), 'message': $("#form-contact #message").val()};
					$.ajax({
						type: 'post',
						url: URLServer + '/server/contact.php',
						data: data,
						dataType: 'json',
						//contentType: false, //  si data = FormData
						//processData: false, // = false si data = FormData
						cache: false,
						success: function (response){
							//console.log(response);
							if(typeof response.error !== 'undefined'){
								alert(response.error.msg);
								if(response.error.code == 2){
									$(window).attr('location', 'index.html');	
								}
							}else if(typeof response.contact !== 'undefined'){
								//alert(response.user.id);
								popupError("popupError4", "Message Envoyé.", "Contact", 1);
								
								$("#form-contact #nom").val('');
								$("#form-contact #message").val('');
								//window.sessionStorage.removeItem(timestamp);
							}
						},
						error: function (response){
							popupError("popupError4", "Erreur accès réseau");
						}
					});
				}
				
				//alert('Identifiants incorrect');
				return false;
			});
		}
		
	}
	
	function chargementPageAfter(){
		
		if($.mobile.activePage[0].id == "page-stats" || $.mobile.activePage[0].id == "page-publier"){
			
			$(".ui-content .onglet:first").show();
			
			$(".ui-header .ui-navbar li a.ui-link").click(function(e){
				$(".ui-content .onglet").hide();
				$(".ui-content .onglet").eq($(this).parent('li').index()).fadeIn(function(){
				if($.mobile.activePage[0].id == "page-stats"){
					chargementStats();
				}
				} );
			});
		}
		
		if($.mobile.activePage[0].id == "page-stats"){
			chargementStats();
		}
		
		function chargementStats(){
			Chart.defaults.global.responsive = true;
			Chart.defaults.global.maintainAspectRatio = false;			
			//Chart.defaults.global.animation = false;
			
			var data = {'id_user': window.sessionStorage.getItem("user_id"), 'sess_id': window.sessionStorage.getItem("user_sess_id")};
			$.ajax({
				type: 'post',
				url: URLServer + '/server/analytics.php',
				data: data,
				dataType: 'json',
				cache: false,
				success: function (response){
					//console.log(response);
					if(typeof response.error !== 'undefined'){
						alert(response.error.msg);
						if(response.error.code == 2){
							$(window).attr('location', 'index.html');	
						}
					}else if(typeof response.graph !== 'undefined'){
						// Création des graphiques
						//popupError("popupError2", "Connexion réussie.", "Succès", 1);
						
						// Affiche les onglets pour que ça soit bien généré et les masque à la fin
						//$(".ui-content .onglet").show();
						
						var graph_labels = new Array();
						var graph_data1 = new Array();
						var graph_data2 = new Array();
						var total_week_v = 0;
						var total_week_p = 0;
						var total_rebond = 0;
						var taux_rebond = 0;
						var temps_total = 0;
						var temps_moyen = 0;
						for(var i=0; i < response.graph.last_week.length ; i++){
							var d = response.graph.last_week[i][0];
							graph_labels.push(d.substring(6, 8) + '/' + d.substring(4, 6));
							graph_data1.push(response.graph.last_week[i][1]);
							graph_data2.push(response.graph.last_week[i][2]);
							total_week_v += parseInt(response.graph.last_week[i][1]);
							total_week_p += parseInt(response.graph.last_week[i][2]);
							total_rebond += parseInt(response.graph.last_week[i][3]);
							temps_total += parseInt(response.graph.last_week[i][4]);
						}
						if(total_week_v>0){
							taux_rebond = total_rebond / total_week_v * 100;
							temps_moyen = Math.round(temps_total / total_week_v);
							temps_moyen = parseInt(temps_moyen/60) + ':' + temps_moyen%60 + '';
						}
						
						var data = {
							labels: graph_labels,
							datasets: [
								{
									label: "Visites",
									fillColor: "rgba(151,187,205,0.2)",
									strokeColor: "rgba(151,187,205,1)",
									pointColor: "rgba(151,187,205,1)",
									pointStrokeColor: "#fff",
									pointHighlightFill: "#fff",
									pointHighlightStroke: "rgba(151,187,205,1)",
									data: graph_data1
								},
								{
									label: "Pages vues",
									fillColor: "rgba(220,220,220,0.2)",
									strokeColor: "rgba(220,220,220,1)",
									pointColor: "rgba(220,220,220,1)",
									pointStrokeColor: "#fff",
									pointHighlightFill: "#fff",
									pointHighlightStroke: "rgba(220,220,220,1)",
									data: graph_data2
								}
							]
						};
						var options = {
							animationSteps: 10,
							bezierCurve : false,
							labelsxStep : 2
						};
						
						$("#myChart").attr({'width': 400, 'height': 300}).css({'width': 400, 'height': 300});
						if($("#myChart").is(":visible")){
							var ctx = $("#myChart").get(0).getContext("2d");
							var myNewChart = new Chart(ctx).LineAlt(data, options);
							$("#graph1 .legend").html(myNewChart.generateLegend());
							
							$(".onglet-1 .stats-nombres .visiteurs .nb").text(total_week_v);
							$(".onglet-1 .stats-nombres .pages-vues .nb").text(total_week_p);
							$(".onglet-1 .stats-nombres .taux-rebond .nb").text(Math.round(taux_rebond));
							$(".onglet-1 .stats-nombres .temps-moyen .nb").text(temps_moyen);
							
							$(".onglet-1 .tableau-donnees table tbody").empty();
							var tabJour = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
							for(var i=response.graph.last_week.length-1 ; i>=0 ; i--){
								var d = response.graph.last_week[i][0];
								var d = new Date(d.substring(0, 4) + '-' + d.substring(4, 6) + '-' + d.substring(6, 8));
								$(".onglet-1 .tableau-donnees table tbody").append('<tr><td class="jour">' + tabJour[d.getDay()] + ' ' + d.getDate() + '</td><td>' + graph_data1[i] + '</td><td>' + graph_data2[i] + '</td></tr>');
							}
							
						}
						
						
						// GRAPH 2
						var graph_labels = new Array();
						var graph_data1 = new Array();
						var graph_data2 = new Array();
						for(var i=0; i < response.graph.last_year.length ; i++){
							graph_labels.push(response.graph.last_year[i]['label']);
							graph_data1.push(response.graph.last_year[i][2]);
							graph_data2.push(response.graph.last_year[i][3]);
						}
						
						var data = {
							labels: graph_labels,
							datasets: [
								{
									label: "Visites",
									fillColor: "rgba(151,187,205,0.5)",
									strokeColor: "rgba(151,187,205,0.8)",
									highlightFill: "rgba(151,187,205,0.75)",
									highlightStroke: "rgba(151,187,205,1)",
									data: graph_data1
								},
								{
									label: "Pages vues",
									fillColor: "rgba(220,220,220,0.5)",
									strokeColor: "rgba(220,220,220,0.8)",
									highlightFill: "rgba(220,220,220,0.75)",
									highlightStroke: "rgba(220,220,220,1)",
									data: graph_data2
								}
							]
						};
						var options = {
							animationSteps: 10
						};
						
						$("#myChart2").attr({'width': 400, 'height': 300}).css({'width': 400, 'height': 300});
						if($("#myChart2").is(":visible")){
							var ctx = $("#myChart2").get(0).getContext("2d");
							var myNewChart = new Chart(ctx).Bar(data, options);
							$("#graph2 .legend").html(myNewChart.generateLegend());
							
							$(".onglet-2 .tableau-donnees table tbody").empty();
							var tabMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
							for(var i=response.graph.last_year.length-1 ; i>=0 ; i--){
								$(".onglet-2 .tableau-donnees table tbody").append('<tr><td class="jour">' + tabMois[parseInt(graph_labels[i].substring(0, 2))-1] + '</td><td>' + graph_data1[i] + '</td><td>' + graph_data2[i] + '</td></tr>');
							}
						}
						
						// ONGLET 3 
						$(".onglet-3 .tableau-donnees table.city tbody").empty();
						for(var i=0; i < response.graph.city.length ; i++){
							$(".onglet-3 .tableau-donnees table.city tbody").append('<tr><td class="jour">' + response.graph.city[i][0] + '</td><td>' + response.graph.city[i][1] + '</td></tr>');
						}
						$(".onglet-3 .tableau-donnees table.source tbody").empty();
						for(var i=0; i < response.graph.source.length ; i++){
							$(".onglet-3 .tableau-donnees table.source tbody").append('<tr><td class="jour">' + response.graph.source[i][0] + '</td><td>' + response.graph.source[i][1] + '</td></tr>');
						}
						
						// affiche que le 1er onglet
						//$(".ui-content .onglet").hide();
						//$(".ui-content .onglet:first").show();
						
					}
				},
				error: function (response){
					popupError("popupError2", "Erreur accès réseau");
				}
			});
			
		}
		
		if($.mobile.activePage[0].id == "page-publier"){
			
				/*function resolveOnSuccess(entry) {
					entry.file( function(file) { alert('entry');
						var reader = new FileReader();
						reader.onloadend = function(evt) {
							alert(file.type);
							//data.append('photo', new Blob([evt.target.result],{"type":file.type}), "photo.jpg");
							
						};
						reader.readAsArrayBuffer( file );
					}, null );
				}*/
			/*	
			$("#page-publier .image-upload-selection label").click(function(e) {
				// Prend une image dans la galerie photo
				var self = $(this);
				navigator.camera.getPicture(function(imageURI){
						var blocApercu = self.parents(".onglet").find(".upload-apercu");
						blocApercu.empty();
						blocApercu.append('<img src="">');
						blocApercu.find('img').attr('src', imageURI);
						
						self.parents(".onglet").find("input.champ-photo").val(imageURI);
						blocApercu.append('<a href="#" class="actu-sup-photo" data-role="button" data-icon="delete" data-iconpos="notext" data-theme="c" data-inline="true">Sup</a>');
						blocApercu.find("a.actu-sup-photo").button().click(function(e) {
                            alert("ok");
                        });
						//window.resolveLocalFileSystemURI($('#form-actu input#champ-photo').val(), resolveOnSuccess, null);
						
					}, null, { quality: 50,
					destinationType: destinationType.FILE_URI,
					sourceType: pictureSource.PHOTOLIBRARY,
					encodingType: encodingType.JPEG,
					mediaType: mediaType.PICTURE
				});
            });
				
			$("#page-publier .image-upload-camera label").click(function(e) {
				// Prend une image avec l'appareil photo
				var self = $(this);
				navigator.camera.getPicture(function(imageURI){
						var blocApercu = self.parents(".onglet").find(".upload-apercu");
						blocApercu.empty();
						blocApercu.append('<img src="">');
						blocApercu.find('img').attr('src', imageURI);
						
						self.parents(".onglet").find("input.champ-photo").val(imageURI);
						//window.resolveLocalFileSystemURI($('#form-actu input#champ-photo').val(), resolveOnSuccess, null);
						
					}, null, { quality: 50,
					destinationType: destinationType.FILE_URI,
					encodingType: encodingType.JPEG
				});
            });*/
			
			/*$("#page-publier .image-upload-camera input, #page-publier .image-upload-selection input").change(function(){
				//$(this).parents(".image-upload").find("label span").append(" <strong>(sélectionnée)</strong>");
				
				// Affichage d'un apercu de la photo
				var self = $(this);
				var input = $(this)[0];
				if (input.files && input.files[0]) {
					var reader = new FileReader();
				
					reader.onload = function (e) {
						var blocApercu = self.parents(".onglet").find(".upload-apercu");
						blocApercu.empty();
						blocApercu.append('<img src="">');
						blocApercu.find('img').attr('src', e.target.result);
						self.parents(".onglet").find("input.champ-photo").val(self.attr('id'));
						$.mobile.loading( 'hide' );
					}
					
					$.mobile.loading( 'show', {
						text: 'Chargement en cours...',
						textVisible: true,
						theme: 'a',
						html: ""
					});
					reader.readAsDataURL(input.files[0]);
				}
			});*/
			
			
			var data = {'id_user': window.sessionStorage.getItem("user_id"), 'sess_id': window.sessionStorage.getItem("user_sess_id")};
			$.ajax({
				type: 'post',
				url: URLServer + '/server/site.php',
				data: data,
				dataType: 'json',
				cache: false,
				success: function (response){
					//console.log(response);
					if(typeof response.error !== 'undefined'){
						alert(response.error.msg);
						if(response.error.code == 2){
							$(window).attr('location', 'index.html');	
						}
					}else if(typeof response.site !== 'undefined'){
						
						// affiche les onglets activés pour ce site
						var nb_onglet = 0;
						if(response.site.acces_actualite == 1){
							$("#page-publier .publier-tabs .onglet-actualite").show();
							nb_onglet++;
						}else{
							$("#page-publier .publier-tabs .onglet-actualite").hide();
						}
						if(response.site.acces_galerie == 1){
							$("#page-publier .publier-tabs .onglet-galerie").show();
							if(nb_onglet==0){
								$("#page-publier .publier-tabs .onglet-galerie a").trigger('click');
							}
							nb_onglet++;
						}else{
							$("#page-publier .publier-tabs .onglet-galerie").hide();
						}
						if(nb_onglet == 1){
							$("#page-publier .publier-tabs li").css({'width': '100%'});
						}else{
							$("#page-publier .publier-tabs li").css({'width': '50%'});
						}
						
					}
				},
				error: function (response){
					popupError("popupError3", "Erreur accès réseau");
				}
			});
		}
		
		if($.mobile.activePage[0].id == "page-login"){
			centrerLogin();
		}
		
	}
	
});

// Chart Line Perso : Intervall d'affichage des labels en abscisses.		
Chart.types.Line.extend({
	// Passing in a name registers this chart in the Chart namespace in the same way
	name: "LineAlt",
	initialize: function(data){
		Chart.types.Line.prototype.initialize.apply(this, arguments);
	},
	buildScale : function(labels){
		Chart.types.Line.prototype.buildScale.apply(this, arguments);
		//console.log(labels);
		//console.log(this.scale.xLabels);
		
		var options = this.options;
		if(options.labelsxStep){
			var tabLabels = new Array();
			for(var i=0; i < labels.length ; i++){
				if(i%options.labelsxStep == 0){
					tabLabels.push(labels[i]);
				}else{
					tabLabels.push('');
				}
			}
			this.scale.xLabels = tabLabels;
		}
	}
});

// Affiche un message en popup
function popupError(id, msg, titre, succes){
	titre = titre || "Erreur !";
	
	if(succes){
		$("#" + id).removeClass('popup-error');
		$("#" + id).addClass('popup-succes');
	}else{
		$("#" + id).removeClass('popup-succes');
		$("#" + id).addClass('popup-error');
	}
	
	$("#" + id).find('.ui-header h1').html(titre);
	$("#" + id).find('.ui-content').html("<p>" + msg + "</p>");
	$("#" + id).popup("open");
}