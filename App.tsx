/**
 * Simplified feed app with horizontal paged feeds and comment modal.
 */

import React, {useRef, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
  Modal,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type Post = {
  id: number;
  user: string;
  content: string;
  likes: number;
  comments: string[];
  liked: boolean;
};

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function LoginScreen({navigation}: any) {
  return (
    <View style={styles.centerScreen}>
      <Text style={styles.loginTitle}>Welcome to Aqualink</Text>
      <Button title="Go to Feed" onPress={() => navigation.replace('Feed')} />
    </View>
  );
}

function FeedScreen({navigation}: any) {
  const avatars: Record<string, string> = {
    Alice: 'https://randomuser.me/api/portraits/women/1.jpg',
    Bob: 'https://randomuser.me/api/portraits/men/2.jpg',
    Carol: 'https://randomuser.me/api/portraits/women/3.jpg',
    Dave: 'https://randomuser.me/api/portraits/men/4.jpg',
    Eve: 'https://randomuser.me/api/portraits/women/5.jpg',
    Frank: 'https://randomuser.me/api/portraits/men/6.jpg',
    Grace: 'https://randomuser.me/api/portraits/women/7.jpg',
    Henry: 'https://randomuser.me/api/portraits/men/8.jpg',
    Ivy: 'https://randomuser.me/api/portraits/women/9.jpg',
    Jack: 'https://randomuser.me/api/portraits/men/10.jpg',
    Kate: 'https://randomuser.me/api/portraits/women/11.jpg',
  };

  const feedPages: Post[][] = [
    [
      {id: 1, user: 'Alice', content: 'Just joined Aqualink! Excited to connect with everyone.', likes: 2, comments: ['Welcome Alice!'], liked: false},
      {id: 2, user: 'Bob', content: 'What a beautiful day to share some photos!', likes: 5, comments: ['Nice!', 'Show us more!'], liked: false},
      {id: 3, user: 'Carol', content: 'Loving the new features on Aqualink!', likes: 3, comments: ['Me too!'], liked: false},
    ],
    [
      {id: 1, user: 'Dave', content: 'Anyone up for a meetup this weekend?', likes: 1, comments: ['I am!'], liked: false},
      {id: 2, user: 'Eve', content: 'Check out my latest blog post!', likes: 4, comments: ['Great read!'], liked: false},
      {id: 3, user: 'Frank', content: 'Just finished a marathon!', likes: 6, comments: ['Congrats!'], liked: false},
    ],
    [
      {id: 1, user: 'Grace', content: 'Aqualink is the best!', likes: 7, comments: ['Absolutely!'], liked: false},
      {id: 2, user: 'Henry', content: 'Looking for book recommendations.', likes: 2, comments: ['Try "1984"!'], liked: false},
      {id: 3, user: 'Ivy', content: 'Just adopted a puppy!', likes: 8, comments: ['So cute!'], liked: false},
    ],
    [
      {id: 1, user: 'Jack', content: 'Who wants to play chess?', likes: 3, comments: ['I do!'], liked: false},
      {id: 2, user: 'Kate', content: 'Started a new job today!', likes: 5, comments: ['Congrats!'], liked: false},
      {id: 3, user: 'Alice', content: 'Enjoying a sunny day at the park.', likes: 2, comments: ['Nice!'], liked: false},
    ],
    [
      {id: 1, user: 'Bob', content: 'Back to sharing photos!', likes: 5, comments: [], liked: false},
      {id: 2, user: 'Carol', content: 'The features keep getting better.', likes: 4, comments: [], liked: false},
      {id: 3, user: 'Dave', content: 'Meetup was a success!', likes: 9, comments: [], liked: false},
    ],
    [
      {id: 1, user: 'Eve', content: 'New blog post is live!', likes: 6, comments: [], liked: false},
      {id: 2, user: 'Frank', content: 'Training for the next marathon.', likes: 8, comments: [], liked: false},
      {id: 3, user: 'Grace', content: 'Still the best app.', likes: 10, comments: [], liked: false},
    ],
  ];

  const [pages, setPages] = useState<Post[][]>(feedPages);
  const [commentText, setCommentText] = useState('');
  const [activePostForComment, setActivePostForComment] = useState<{pageIdx: number; postId: number} | null>(null);
  const feedListRef = useRef<FlatList<Post[]> | null>(null);
  const {width} = useWindowDimensions();

  const handleLike = (pageIdx: number, postId: number) => {
    setPages(prev =>
      prev.map((posts, idx) =>
        idx === pageIdx
          ? posts.map(p =>
              p.id === postId ? {...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked} : p,
            )
          : posts,
      ),
    );
  };

  const handleComment = () => {
    if (!activePostForComment || commentText.trim() === '') return;
    const {pageIdx, postId} = activePostForComment;
    setPages(prev =>
      prev.map((posts, idx) =>
        idx === pageIdx
          ? posts.map(p => (p.id === postId ? {...p, comments: [...p.comments, commentText]} : p))
          : posts,
      ),
    );
    setCommentText('');
    setActivePostForComment(null);
  };

  const renderPost = (pageIdx: number) => ({item: post}: {item: Post}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('PostDetail', {
          post,
          avatar: avatars[post.user] || avatars['Alice'],
        })
      }>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{uri: avatars[post.user] || avatars['Alice']}} style={styles.avatar} />
          <Text style={styles.username}>{post.user}</Text>
        </View>
        <Text style={styles.content}>{post.content}</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => handleLike(pageIdx, post.id)} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💧</Text>
            <Text style={styles.actionText}>{post.likes} Splashes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActivePostForComment({pageIdx, postId: post.id})}
            style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📢</Text>
            <Text style={styles.actionText}>{post.comments.length} Echoes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeedPage = ({item: posts, index: pageIdx}: {item: Post[]; index: number}) => (
    <View style={{width, flex: 1, paddingTop: 8}}>
      <FlatList
        data={posts}
        renderItem={renderPost(pageIdx)}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between', paddingVertical: 8}}
        ItemSeparatorComponent={() => <View style={{height: 12}} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{height: 8}} />}
      />
    </View>
  );

  return (
    <View style={styles.feedScreen}>
      <FlatList
        ref={feedListRef}
        data={pages}
        renderItem={renderFeedPage}
        keyExtractor={(_, idx) => idx.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={activePostForComment !== null}
        onRequestClose={() => setActivePostForComment(null)}>
        <SafeAreaProvider>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Echoes</Text>
              <Button title="Close" onPress={() => setActivePostForComment(null)} />
            </View>
            <FlatList
              data={
                activePostForComment
                  ? pages[activePostForComment.pageIdx].find(p => p.id === activePostForComment.postId)?.comments || []
                  : []
              }
              renderItem={({item}) => <Text style={styles.commentText}>- {item}</Text>}
              keyExtractor={(item, index) => `${item}-${index}`}
              contentContainerStyle={{padding: 16}}
            />
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add an echo..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <Button title="Cast" onPress={handleComment} />
            </View>
          </View>
        </SafeAreaProvider>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, {color: '#1877f2'}]}>⌂</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Tide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.navIcon}>🔎</Text>
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemAction}>
          <Text style={styles.navIconAction}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.navIcon}>⚓</Text>
          <Text style={styles.navText}>Harbour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PostDetailScreen({route}: any) {
  const {post, avatar} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 20}}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{uri: avatar}} style={styles.avatar} />
          <Text style={styles.username}>{post.user}</Text>
        </View>
        <Text style={styles.content}>{post.content}</Text>
      </View>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.centerScreen}>
      <Text>Search Screen</Text>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={styles.centerScreen}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

function ProfileScreen({navigation}: any) {
  return (
    <View style={styles.centerScreen}>
      <Text>Profile Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function MessagesScreen({navigation}: any) {
  return (
    <View style={styles.centerScreen}>
      <Text>Messages Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  feedScreen: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  content: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  actionIcon: {
    fontSize: 18,
    color: '#65676b',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#65676b',
    fontWeight: '600',
  },
  modalView: {
    flex: 1,
    marginTop: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
    backgroundColor: '#fafbfc',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  navItemAction: {
    backgroundColor: '#1877f2',
    borderRadius: 18,
    width: 60,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  navIcon: {
    fontSize: 24,
    color: '#65676b',
  },
  navIconAction: {
    fontSize: 24,
    color: '#fff',
  },
  navText: {
    fontSize: 11,
    color: '#65676b',
  },
  navTextActive: {
    color: '#1877f2',
    fontWeight: 'bold',
  },
});

export default App;
