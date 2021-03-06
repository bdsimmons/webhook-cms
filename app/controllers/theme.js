export default Ember.ObjectController.extend({
  themes   : null,
  isSending: false,
  success  : false,
  error    : null,
  customUrl: '',

  presetReady: function (data) {
    data = data || {};

    if (Ember.isNone(data.data) && Ember.isNone(data.contentType)) {
      data = { contentType: data };
    }

    var controller = this;

    window.ENV.firebase.update(data, function(err) {
      controller.send('gruntCommand', 'build', function() {
        controller.set('isSending', false);
        controller.send('notify', 'success', 'Theme installation complete.');
        controller.transitionToRoute('wh');
      });
    });
  },

  actions: {
    downloadPreset: function (theme) {

      this.setProperties({
        success: false,
        error: null
      });

      if (Ember.isNone(theme)) {
        this.set('error', { message: 'Please choose a theme.' });
        return;
      }

      this.set('isSending', true);
      this.send('gruntCommand', 'preset:' + theme.url, this.presetReady.bind(this));
    },

    downloadCustom: function () {

      this.setProperties({
        success: false,
        error: null
      });

      if (Ember.isNone(this.get('customUrl'))) {
        this.set('error', { message: 'Please provide a custom URL.' });
        return;
      }

      this.set('isSending', true);
      this.send('gruntCommand', 'preset:' + this.get('customUrl'), this.presetReady.bind(this));
    },

    localThemeSelected: function (file) {

      this.setProperties({
        success: false,
        error: null
      });

      if (Ember.isNone(file)) {
        this.set('error', { message: 'Please select a zip file.' });
        return;
      }

      this.set('isSending', true);

      var reader = new window.FileReader();

      reader.onload = function(e) {

        // strip off 'data:application/zip;base64,'
        var base64Data = e.target.result.split(',').slice(1).join(',');

        this.send('gruntCommand', 'preset_local:' + base64Data, this.presetReady.bind(this));

      }.bind(this);

      reader.readAsDataURL(file);

    }
  }
});
