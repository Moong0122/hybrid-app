import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");

export default class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      // to-do 항목을 다 했는가
      isCompleted: false,
      // 편집하는 내용을 저장해준다
      toDoValue: props.text
    };
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    uncompleteToDo: PropTypes.func.isRequired,
    completeToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired
  };

  render() {
    const { isEditing, toDoValue } = this.state;
    const { text, id, deleteToDo, isCompleted } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toggleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle
              ]}
            />
            {/* 내용 수정을 위해 연필 버튼을 눌렀을 때! */}
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={[
                styles.text,
                styles.input,
                isCompleted ? styles.completedText : styles.uncompletedText
              ]}
              value={toDoValue}
              multiline={true}
              onChangeText={this._controlInput}
              returnKeyType={"done"}
              // 편집하다가 칸 밖을 클릭하면 편집 종료
              onBlur={this._finishEditing}
              underlineColorAndroid={"transparent"}
            />
          ) : (
            <Text
              style={[
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText
              ]}
            >
              {text}
            </Text>
          )}
        </View>
        {/* 연필 부분과 엑스 자 부분들 포함하고 있다 */}
        {isEditing ? (
          // 지금 수정 중이라면 체크표시 설정해주고
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <View style={styles.actionText}>
                  <Image source={require("./img/check_32.png")} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          // 그렇지 않다면 연필과 엑스자 설정해주기
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                {/* <View style={styles.actionText}> */}
                <Image
                  style={styles.actionText}
                  source={require("./img/pencil_32.png")}
                />
                {/* </View> */}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPressOut={event => {
                event.stopPropagation;
                deleteToDo(id);
              }}
            >
              <View style={styles.actionContainer}>
                {/* <View style={styles.actionText}> */}
                <Image
                  style={styles.actionText}
                  source={require("./img/delete_32.png")}
                />
                {/* </View> */}
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  _toggleComplete = event => {
    event.stopPropagation();
    const { isCompleted, uncompleteToDo, completeToDo, id } = this.props;
    if (isCompleted) {
      uncompleteToDo(id);
    } else {
      completeToDo(id);
    }
  };
  // 편집 모드 /  수정 안 할 때 모드 -> push the pencil
  _startEditing = event => {
    event.stopPropagation();
    this.setState({
      isEditing: true
    });
  };
  // 편집을 다 끝내고 체크표시 누르려고 할 때
  _finishEditing = event => {
    event.stopPropagation();
    const { toDoValue } = this.state;
    const { id, updateToDo } = this.props;
    updateToDo(id, toDoValue);
    this.setState({ isEditing: false });
  };
  _controlInput = text => {
    this.setState({ toDoValue: text });
  };
}
const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    // 나란히 위치해야 하므로 row
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 30,
    height: 30,
    // width, height의 절반이어야 원을 만들 수 있다
    borderRadius: 15,
    borderColor: "#0288D1",
    borderWidth: 3,
    marginRight: 20,
    marginLeft: 10
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  },
  // to-do 완료 시 동그라미 클릭
  completedCircle: {
    borderColor: "#bbb"
  },
  // to-do 아직 미완료시
  uncompletedCircle: {
    borderColor: "#0288D1"
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  input: {
    paddingBottom: 5,
    marginVertical: 15,
    width: width / 2
  }
});
