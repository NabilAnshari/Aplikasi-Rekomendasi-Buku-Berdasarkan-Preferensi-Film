import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthForm({ type, onSubmit }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (type === "register") {
      onSubmit({ name, email, password, confPassword });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <View className="w-full">
      {type === "register" && (
        <>
          <Text className="text-gray-800 mb-1 font-semibold">Name</Text>
          <TextInput
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            className="border border-gray-300 rounded-xl p-3 mb-4 bg-gray-50"
          />
        </>
      )}

      <Text className="text-gray-800 mb-1 font-semibold">Email</Text>
      <TextInput
        placeholder="Your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="border border-gray-300 rounded-xl p-3 mb-4 bg-gray-50"
      />

      <Text className="text-gray-800 mb-1 font-semibold">Password</Text>
      <View className="flex-row items-center border border-gray-300 rounded-xl mb-4 bg-gray-50">
        <TextInput
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="flex-1 p-3"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-3">
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {type === "register" && (
        <>
          <Text className="text-gray-800 mb-1 font-semibold">Confirm Password</Text>
          <TextInput
            placeholder="Confirm password"
            value={confPassword}
            onChangeText={setConfPassword}
            secureTextEntry
            className="border border-gray-300 rounded-xl p-3 mb-4 bg-gray-50"
          />
        </>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-purple-700 rounded-full py-4"
      >
        <Text className="text-center text-white font-bold text-lg">
          {type === "register" ? "Register" : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
