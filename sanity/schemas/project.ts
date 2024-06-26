import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'projects',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Project Name',
      type: 'string',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Project Category',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Project Url',
      type: 'url',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
    }),
    defineField({
      name: 'video',
      title: 'Project Video',
      type: 'file',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'file',
    },
  },
})
