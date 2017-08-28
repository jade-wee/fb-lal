$(document).ready(function() {
  $(function() {
    $("#lal_slider").slider({
      range: "max",
      min: 11,
      max: 20,
      value: 20,
      slide: function(event, ui) {
        $("#lal_value").text(ui.value);
      }
    });
    $("#lal_value").val($("#lal_slider").slider("value"));
  });

  $(".validation").hide();
  $(".successResponse").hide();
  $(".errorResponse").hide();

  $("form").submit(function(e){
    e.preventDefault();
    validateForm();
  });

  function validateForm() {
    var passed = true;

    if ($("#a_name").val() === "" || $("#a_id").val() === "" || $("#country_dropdown").val() === null || $("#account_dropdown").val() === null) {
      passed = false;
      $(".validation").show();
    } else {
      $(".validation").hide();
    }

    if (passed) {
      processData();
    } else {
      $(".success").hide();
      $(".error").hide();

      $('html,body').animate({ scrollTop: 0 }, 'slow');

      return false;
    }
  }

  function processData() {

    var audience_name = "Lookalike (" + $("#country_dropdown").val() + ", " + $("#lal_value").text() + "%) - " + $("#a_name").val();

    var lal_ratio = parseInt($("#lal_value").text()) / 100;

    var account_obj = {
      "ID": {"country": "act_10154201522535343", "regional": "act_960713844017539"},
      "MY": {"country": "act_975721032516820", "regional": "act_1510253962542106"},
      "PH": {"country": "act_286163198", "regional": "act_960709704017953"},
      "SG": {"country": "act_937391186349805", "regional": "act_936786009743656"},
      "TH": {"country": "act_1381390565431254", "regional": "act_960710254017898"},
      "VN": {"country": "act_1375009352774405", "regional": "act_975723752516548"},
      "MM": {"country": "act_1269417169813870", "regional": "act_1269412346481019"},
      "MYtwo": {"country": "act_1226314357457485"},
      "SGtwo": {"country": "act_1214763765279211"},
      "IDtwo": {"country": "act_1226315040790750"},
      "MMtwo": {"country": "act_1294931020595818"}
    };

    var account_id = account_obj[$("#country_dropdown").val()][$("#account_dropdown").val()];

    // ACCESS_TOKEN logic

    var processedData = {"name": audience_name, "origin_audience_id": $("#a_id").val(), "subtype": "LOOKALIKE", "lookalike_spec": {"country": $("#country_dropdown").val(), "ratio": lal_ratio}, "access_token": "EAADeZBgSHnjsBAJi4JGHWUpFeA13bm2SjvOfDL1llxouZB4TSJPZBLZAw2TIgFZA9pbDAuEfD4dsysKiPHcSOkDy1n5ZBAmZC7Fo6I3q65PJYFkHX0h8O2cBFot6jFjD0PCZBzYMMs2aGriUv551kvlaV1Mvltmd7ZC8NJNBjnZA1xkwZDZD"};

    submitLAL(processedData, account_id);
  }

  function submitLAL(formData, account_id) {
    // BIZ_MANAGER_ID logic

    $.ajax({
      url: "https://graph.facebook.com/v2.9/" + account_id + "/customaudiences",
      type: 'POST',
      dataType: 'json',
      data: formData,
      success: function(response) {
        $(".errorResponse").hide();
        $(".successResponse").show();

        var successMsg = document.getElementById("success-msg");
        successMsg.innerHTML = "Congratulations! You have created a " + $("#lal_value").text() + "% lookalike for " + $("#a_name").val();
      },
      error: function(xhr, status, error) {
        console.log(JSON.stringify(xhr.responseJSON));

        $(".successResponse").hide();
        $(".errorResponse").show();

        var errorMsg = document.getElementById("error-msg");
        errorMsg.innerHTML = "Sorry, I am unable to create a lookalike audience.<br />This is the error message: " + JSON.stringify(xhr.responseJSON.error.message);
      }
    });

    $('html,body').animate({ scrollTop: 0 }, 'slow');
  }
});
