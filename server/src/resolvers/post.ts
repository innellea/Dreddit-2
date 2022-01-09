import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }
  //
  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  // createPost
  @Mutation(() => Post)
  async createPost(@Arg('title') title: string): Promise<Post> {
    // 2 sql queries
    return Post.create({ title }).save();
  }

  // updatePost
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    //TODO combine 2 sql to 1
    //! 1st
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    // ! 2nd
    if (typeof title !== 'undefined') Post.update({ id }, { title });

    return post;
  }

  // deletePost
  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
