import RNFS from "react-native-fs";
const rootPath = RNFS.DocumentDirectoryPath;
getName = async () => {
	const path = rootPath + "assets/rn.txt";
	var content = await RNFS.readFile(path, "utf8");
	return content;
};

export default {
	getNames
}