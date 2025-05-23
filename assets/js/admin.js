jQuery(document).ready(function ($) {
	//var wpp_months_name = WPP_I18N.months;
	var wpp_months_name = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];


  $('.wp-editor-wrap.html-active #content').css("direction", "ltr");

  function IsLeapYear(year) {
    if (((year % 4) === 0 && (year % 100) !== 0) || (year % 400) === 0 && (year % 100) === 0)
      return true;
    else
      return false;
  }

  function persian_to_gregorian(jy, jm, jd) {
    var j_days_sum_month = [0, 0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365];
    var g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var g_days_leap_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var gd = j_days_sum_month[parseInt(jm)] + parseInt(jd), gm, gy = parseInt(jy) + 621;
    if (gd > 286) gy++;
    if (IsLeapYear(gy - 1) && 286 < gd) gd--;
    if (gd > 286) gd -= 286; else gd += 79;
    if (IsLeapYear(gy)) {
      for (gm = 0; gd > g_days_leap_month[gm]; gm++) {
        gd -= g_days_leap_month[gm];
      }
    } else {
      for (gm = 0; gd > g_days_in_month[gm]; gm++) gd -= g_days_in_month[gm];
    }
    gm++;
    if (gm < 10) gm = '0' + gm;
    return [gy, gm, gd];
  }

  function gregorian_to_persian(gy, gm, gd) {
    var j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    var g_days_sum_month = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    var day_of_year = g_days_sum_month[parseInt(gm)] + parseInt(gd);
    var leab = IsLeapYear(gy);
    var leap = IsLeapYear(gy - 1);
    var jd, jm, jy, i;
    if (day_of_year > 79) {
      jd = (leab ? day_of_year - 78 : day_of_year - 79);
      jy = gy - 621;
      for (i = 0; jd > j_days_in_month[i]; i++) jd -= j_days_in_month[i];
    } else {
      jd = ((leap || (leab && gm > 2)) ? 287 + day_of_year : 286 + day_of_year);
      jy = gy - 622;
      if (leap === false && jd === 366) return [jy, 12, 30];
      for (i = 0; jd > j_days_in_month[i]; i++) jd -= j_days_in_month[i];
    }
    jm = ++i;
    jm = (jm < 10 ? jm = '0' + jm : jm);
    return [jy, jm, jd];
  }

  /*
   * Edit inline
   */
  function create_stampdiv(year, mon, day, hour, minu) {
    var div = '<div class="timestamp-wrap persian">' +
        '<select id="mma" name="mma">';
    for (var i = 1; i < 13; i++) {
      if (i === parseInt(mon))
        div += '<option value="' + i + '" selected="selected">' + wpp_months_name[i] + '</option>';
      else
        div += '<option value="' + i + '">' + wpp_months_name[i] + '</option>';
    }
    div += '</select>' +
        '<input type="text" id="jja" name="jja" value="' + day + '" size="2" maxlength="2" autocomplete="off" />,' +
        '<input type="text" id="aaa" name="aaa" value="' + year + '" size="4" maxlength="4" autocomplete="off" /> در ' +
        '<input type="text" id="hha" name="hha" value="' + hour + '" size="2" maxlength="2" autocomplete="off" /> : ' +
        '<input type="text" id="mna" name="mna" value="' + minu + '" size="2" maxlength="2" autocomplete="off" />' +
        '</div>';
    return div;
  }

  $('a.edit-timestamp').on('click', function () {
    $('.persian').remove();
    var date = gregorian_to_persian($('#aa').val(), $('#mm').val(), $('#jj').val());
    var div = create_stampdiv(date[0], date[1], date[2], $('#hh').val(), $('#mn').val());
    $('#timestampdiv').prepend(div);
    $('#timestampdiv .timestamp-wrap:eq(1)').hide();
  });

  $('#the-list').on('click', '.editinline', function () {
    var tr = $(this).closest('td');
    var year = tr.find('.aa').html();
    if (year > 1400) {
      var month = tr.find('.mm').html();
      var day = tr.find('.jj').html();
      var hour = tr.find('.hh').html();
      var minu = tr.find('.mn').html();
      var date = gregorian_to_persian(year, month, day);
      $('.persian').remove();
      $('.inline-edit-date').prepend(create_stampdiv(date[0], date[1], date[2], hour, minu));
      $('.inline-edit-date div:eq(1)').hide();
    }
  });
  
  $('#timestampdiv,.inline-edit-date').on('keyup', '#hha', function () {
    $('input[name=hh]').val($(this).val());

  }).on('keyup', '#mna', function () {
    $('input[name=mn]').val($(this).val());

  }).on('keyup', '#aaa , #jja', function () {
    var year = $('#aaa').val();
    var mon = $('#mma').val();
    var day = $('#jja').val();
    date = persian_to_gregorian(year, mon, day);
    $('input[name=aa]').val(date[0]);
    $('select[name=mm]').val(date[1]);
    $('input[name=jj]').val(date[2]);

  }).on('change', '#mma', function () {
    var year = $('#aaa').val();
    var mon = $('#mma').val();
    var day = $('#jja').val();
    date = persian_to_gregorian(year, mon, day);
    $('input[name=aa]').val(date[0]);
    $('select[name=mm]').val(date[1]);
    $('input[name=jj]').val(date[2]);
  });
  
  /*
   * Filter on post screen dates
   */
  $('select[name=m]').hide()
  var timer;

  function change_date() {
    var old = $('#timestamp b').text();
    var info = $('#mma option:selected').text() + ' ' + $('#jja').val() + ', ' + $('#aaa').val() + ' در ' + $('#hha').val() + ':' + $('#mna').val();
    info = info.replace(/\d+/g, function (digit) {
      var ret = '';
      for (var i = 0, len = digit.length; i < len; i++) {
        ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
      }
      return ret;
    });
    if (old != info) {
      $('#timestamp b').html(info);
      clearInterval(timer);
    }
  }

  $('#timestampdiv').on('keypress', function (e) {
    if (e.which == 13)
      timer = setInterval(function () {
        change_date();
      }, 50);
  });

  $('.save-timestamp , .cancel-timestamp , #publish').on('click', function () {
    if ($('#aaa').length)
      timer = setInterval(function () {
        change_date();
      }, 50);
  });
});