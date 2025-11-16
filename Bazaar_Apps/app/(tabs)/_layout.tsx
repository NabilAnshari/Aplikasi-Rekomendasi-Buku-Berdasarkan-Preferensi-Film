import { View, Text, ImageBackground, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight} 
        className="flex flex-row h-full w-full flex-1 min-w-[120px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image
          source={icon}
          className="size-5"
          style={{ tintColor: '#111827' }} 
        />
        <Text className="text-gray-900 text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image
        source={icon}
        className="size-5"
        style={{ tintColor: '#9ca3af' }}
      />
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#ffffff', 
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 30,
          height:52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#A5A5A5', 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.category} title="Category" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'favorite',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="favorite" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
