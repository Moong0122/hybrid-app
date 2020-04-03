import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  Image
} from "react-native";
import ToDo from "./ToDo";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: ""
  };
  render() {
    // state에서 newToDo 저장 -> to do를 작성하는 곳이다
    const { newToDo } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.title_container}>
          <Image style={styles.title_img} source={require("./img/title.png")} />
          <Text style={styles.title}>Today</Text>
          <Image style={styles.title_img} source={require("./img/title.png")} />
        </View>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New to do"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
          />
          {/* _controlNewToDo를 통해 작성된 list들이 ScrollView안에 들어가게 된다 */}
          <ScrollView contentContainerStyle={styles.toDos}>
            <ToDo text={"hihihi"} />
          </ScrollView>
        </View>
      </View>
    );
  }
  // 입력한 값들을 바로 state에 저장시켜준다!
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
}

const styles = StyleSheet.create({
  // 그림과 today 문구 정렬 재정비 필요
  title_img: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10
  },
  title_container: {
    flexDirection: "row",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#92C4F2",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 60,
    fontWeight: "400",
    marginBottom: 20
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
