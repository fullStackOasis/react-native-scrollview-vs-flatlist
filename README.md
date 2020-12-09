The general idea is to test performance of ScrollView vs FlatList

See https://reactnative.dev/docs/scrollview

Use `npm install babel-plugin-transform-remove-console --save-dev` to get the plugin for babel.config.js.

Once it's installed, run `npx react-native start --reset-cache > /tmp/output` and you can check for logging file /tmp/output