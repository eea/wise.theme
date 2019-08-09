In order to develop the theme you need the Grunt command line tool, which can be easily installed via npm::

    $ npm install -g grunt-cli

Then go to the theme folder `src/wise/theme/theme/` and install the theme dependencies::

    $ cd src/wise/theme/theme/
    $ npm install

After executing these commands you can run grunt to watch for any less changes::

    $ grunt watch

This will make sure that the many .less files are compiled to .css on the fly and then served up from the theme.

For development mode, run::

    $ grunt development

For production mode, run::

    $ grunt production


See rules.xml for the relevant Diazo rules.

If you prefer to do a one time compile of the less files you can run::

    $ grunt less
