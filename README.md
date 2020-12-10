The general idea is to test performance of ScrollView vs FlatList

See https://reactnative.dev/docs/scrollview

Use `npm install babel-plugin-transform-remove-console --save-dev` to get the plugin for babel.config.js.

Once it's installed, run `npx react-native start --reset-cache > /tmp/output` and you can check for logging file /tmp/output

To run your experiment:

Tap a button to load 250 names from my server or from in-app. Then:

(1) Tap a button ("Main Screen") that loads the list of names using [React Native ScrollView](https://reactnative.dev/docs/flatlist). Notice the delay before we can navigate there, and also the delay in laying out the screen. The top bar shows when layout is finished, so watch for that. You cannot navigate back until layout is finished.

(2) Tap a button ("Flat Main Screen") that loads the list of names very quickly. This uses a newer, recommended approach for large lists [React Native SectionList](https://reactnative.dev/docs/sectionlist). Currently, it does not work with the vertical alphabet list, although that is displayed together with the list. Notice how fast it loads and lays out. That's because names that are not shown are not laid out immediately.

(3) Tap a button ("Main Screen No Alpha"). This loads the list of names without the vertical alphabet list. It performs slightly better than (1) because there's no vertical alphabet list. That alphabet list is a performance drag on top of the ScrollView implementation. But even so, the FlatList implementation is blazingly fast in comparison!

This code is licensed with an MIT License.

[YouTube video that is run off commit d532ace](https://youtu.be/vI_fuE-J73A)