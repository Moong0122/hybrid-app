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
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { AppLoading } from "expo";
import ToDo from "./ToDo";
// import { v1 as uuidv1 } from "uuid";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    color: "transparent",
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };
  componentDidMount = () => {
    this._loadToDos();
  };
  render() {
    const { newToDo, loadedToDos, toDos, color } = this.state;
    // console.log(toDos);
    // to do가 로딩이 안 되어 있다면
    if (!loadedToDos) {
      return <AppLoading />;
    }
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
            placeholder={"Things to do"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            underlineColorAndroid={"transparent"}
          />
          {/* _controlNewToDo를 통해 작성된 list들이 ScrollView안에 들어가게 된다 */}
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .sort((a, b) => a.createdAt - b.createdAt)
              .map(toDo => (
                // send ToDo -> _deleteToDo function
                <ToDo
                  key={toDo.id}
                  deleteToDo={this._deleteToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  updateToDo={this._updateToDo}
                  newColor={color}
                  {...toDo}
                />
              ))}
          </ScrollView>
        </View>
        <View style={styles.highlight_content}>
          <TouchableOpacity onPressOut={this._changeYellow}>
            <View style={[styles.yellow, styles.yes]} />
          </TouchableOpacity>
          <TouchableOpacity onPressOut={this._changeGreen}>
            <View style={[styles.green, styles.yes]} />
          </TouchableOpacity>
          <TouchableOpacity onPressOut={this._changePurple}>
            <View style={[styles.purple, styles.yes]} />
          </TouchableOpacity>
          <TouchableOpacity onPressOut={this._changeWhite}>
            <View style={[styles.white, styles.yes]} />
          </TouchableOpacity>
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
  _loadToDos = async () => {
    // AsyncStorage.clear();
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      // console.log(toDos);
      this.setState({ loadedToDos: true, toDos: parsedToDos || {} });
    } catch (err) {
      console.log(err);
    }
  };
  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState({
        newToDo: ""
      });
      // 오브젝트를 생성 -> 리스트 끝에 추가해주는 방법
      this.setState(prevState => {
        const ID = Date.now();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now(),
            highlightColor: "transparent"
          }
        };
        const newState = {
          ...prevState,
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _updateToDo = (id, text, color) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text,
            highlightColor: color
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };
  _changeYellow = () => {
    this.setState({
      color: "#ffee58"
    });
  };
  _changeGreen = () => {
    this.setState({
      color: "#aed581"
    });
  };
  _changePurple = () => {
    this.setState({
      color: "#e1bee7"
    });
  };
  _changeWhite = () => {
    this.setState({
      color: "transparent"
    });
  };
}

const styles = StyleSheet.create({
  // 그림과 today 문구 정렬 재정비 필요
  title_img: {
    marginTop: 40,
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
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 20,
    marginBottom: 30,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.3,
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
  },
  yes: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    borderWidth: 2
  },
  yellow: {
    borderColor: "#FFEB3B",
    backgroundColor: "#ffee58"
  },
  green: {
    borderColor: "#9ccc65",
    backgroundColor: "#aed581"
  },
  purple: {
    borderColor: "#b39ddb",
    backgroundColor: "#ce93d8"
  },
  white: {
    borderColor: "#e0e0e0",
    backgroundColor: "white"
  },
  highlight_content: {
    flexDirection: "row",
    padding: 0,
    marginBottom: 20
  }
});
