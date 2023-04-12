# React Native ScrollView vs FlatList

The general idea is to test performance of ScrollView vs FlatList

See https://reactnative.dev/docs/scrollview

Use `npm install babel-plugin-transform-remove-console --save-dev` to get the plugin for babel.config.js.

Once it's installed, run `npx react-native start --reset-cache > /tmp/output` and you can check for logging file /tmp/output

To run your experiment:

Tap a button to load 250 names from my server or from in-app. Then:

(1) Tap a button ("Main Screen") that loads the list of names using [React Native ScrollView](https://reactnative.dev/docs/flatlist). Notice the delay before we can navigate there, and also the delay in laying out the screen. The top bar shows when layout is finished, so watch for that. You cannot navigate back until layout is finished.

(2) Tap a button ("Flat Main Screen") that loads the list of names very quickly. This uses a newer, recommended approach for large lists [React Native SectionList](https://reactnative.dev/docs/sectionlist). Currently, it does not work with the vertical alphabet list [Edit: fixed to work with commit 1141b20], although that is displayed together with the list. Notice how fast it loads and lays out. That's because names that are not shown are not laid out immediately.

(3) Tap a button ("Main Screen No Alpha"). This loads the list of names without the vertical alphabet list. It performs slightly better than (1) because there's no vertical alphabet list. That alphabet list is a performance drag on top of the ScrollView implementation. But even so, the FlatList implementation is blazingly fast in comparison!

This code is licensed with an MIT License.

[YouTube video that is run off commit d532ace](https://youtu.be/vI_fuE-J73A)

# Invariant Violation: scrollToIndex should be used in conjunction with getItemLayout or onScrollToIndexFailed, otherwise there is no way to know the location of offscreen indices or handle failures.

Demo at commit 6eba6d0 includes a bug. If you click a letter in the vertical alphabet list on the "Flat Main Screen" page, you **may** get an "Invariant Violation" error. It happens if you click a letter that links to a section that has not yet been rendered.

This error is discussed in a StackOverflow post, but without any good solution. The problem is that this page may have items in the list that have different heights. You can't know initially how big each item is, so you can know where to scroll in the list.

https://stackoverflow.com/questions/53059609/flat-list-scrolltoindex-should-be-used-in-conjunction-with-getitemlayout-or-on

# Notes about SectionList

Documentation for SectionList - how to use it as it is intended - is poor.

See Jan Söndermann's article where he explains the meaning of `index` in `getItemLayout`: https://medium.com/@jsoendermann/sectionlist-and-getitemlayout-2293b0b916fb

In our case, there index is simply a pointer to each component displayed within the `SafeAreaView` of `SWAlphaFlatListRework` so far as I can tell. It seems to include twice the number of section headers, and I haven't been able to figure out why yet.

Source code suggests that `index` in `getItemLayout` has an extra increment, one for the footer and one for the header - even if you don't use those:
https://github.com/facebook/react-native/blob/master/Libraries/Lists/VirtualizedSectionList.js#L132

https://reactnative.dev/docs/sectionlist

# FlatList

Apr 11 2023 A FlatList has been added to the demo.

The uppermost button has been set to give you the choice to add 2000 items to the FlatList. Once you do this, you will find a warning in Metro server logs:

```
VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 20555.427734375, "dt": 519, "prevDt": 527}
```

Initially, I tried this with "inverted" set to true on the FlatList, because I'd heard reports that Android was especially slow handling inverted FlatLists. However, it turns out that the app showed performance issues even without inverted set.

As you scroll, you'll find the app slows down. "Pulling" down with your finger loads fewer results and the scrolling slows down quite a bit. At some point you start to see white flashing chunks in the list.