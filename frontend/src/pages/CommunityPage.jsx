import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Heart, MessageCircle, Share2, Users, Award, Clock } from "lucide-react";
import { mockData } from "../utils/mock";
import { useToast } from "../hooks/use-toast";

const CommunityPage = () => {
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { toast } = useToast();

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      toast({
        title: "Post Shared!",
        description: "Your post has been shared with the community.",
      });
      setNewPost("");
    }
  };

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow athletes, share your achievements, and learn from experienced coaches and mentors.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Create Post */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarImage src={mockData.user.avatar} />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  Share your athletics journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Share your training progress, achievements, or ask for advice..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {newPost.length}/500 characters
                  </div>
                  <Button 
                    onClick={handlePostSubmit}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={!newPost.trim()}
                  >
                    Share Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-6">
              {mockData.community.posts.map((post) => (
                <Card key={post.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} />
                        <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{post.author}</h3>
                          <Badge variant="secondary" className="text-xs">Coach</Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.timestamp}
                          </div>
                        </div>
                        
                        <h4 className="font-medium text-lg mb-2 text-gray-900">{post.title}</h4>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 text-sm transition-colors ${
                              likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                            <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-500 transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Community Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-red-500" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Members</span>
                    <span className="font-bold text-2xl text-red-500">{mockData.stats.totalMembers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Events</span>
                    <span className="font-bold text-2xl text-blue-500">{mockData.stats.activeEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Training Hours</span>
                    <span className="font-bold text-2xl text-green-500">{mockData.stats.trainingHours.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Members */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 mr-2 text-orange-500" />
                  Featured Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.community.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.speciality}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {member.experience}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white">
                  View All Members
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Find Training Partners
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discussion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;