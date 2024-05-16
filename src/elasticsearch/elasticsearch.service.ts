import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
        cloud: {
            id: process.env.ELASTIC_SEARCH_CLOUD_ID
          },
          auth: {
            username: process.env.ELASTIC_SEARCH_CLOUD_USER,
            password:  process.env.ELASTIC_SEARCH_CLOUD_PASSWORD
          }
    });
  }

  async search(index: string, body: any) {
    return await this.client.search({
      index,
      body,
    });
  }

  async index() {
    return await this.client.indices.create({ index: process.env.ELASTIC_SEARCH_CLOUD_INDEX })
  }

  async getCourse(courseID: string){
    try {
      const response = await this.client.search({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        body: {
            query: {
                query_string: {
                    query: `courseId:${courseID}`
                }
            }
        }
    });
    return response
  } catch (error) {
      // Handle error
      console.error('Error', error);
      throw error;
  }
  }

  async get(id){
    return await this.client.get({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        id: id
      })
  }

  async pushDataToIndex(document: any): Promise<any> {
    try {
      const uniqueId = uuidv4(); // Generate a unique ID for each document
      const response = await this.client.index({
          index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
          id: uniqueId,
          document: document
      });
      console.log('uniqueId',uniqueId)
      return response;
    } catch (error) {
      // Handle error
      console.error('Error pushing data to Elasticsearch:', error);
      throw error;
    }
  }

  async searchBycourseName(courseName: string,teacherId: string){
    try {
      const response = await this.client.search({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        body: {
            query: {
              bool: {
                must: [
                  {
                    query_string: {
                      query: `courseName:*${courseName}*`
              }
                  },
                  {
                    match: {
                      teacherId: teacherId
                    }
                  }
                ]
              }
                // query_string: {
                //     query: `courseName:*${courseName}*` // Place the wildcard inside the query string
                // }
            }
        }
    });
    const result = []
    for(const course of response.hits.hits){
      if (typeof course._source === 'object' && course._source !== null && 'courseId' in course._source&& 'courseName' in course._source) {
        result.push(
          {
            courseId: course._source.courseId,
            courseName: course._source.courseName,
          })
      }
    }
    return result
  } catch (error) {
      // Handle error
      console.error('Error', error);
      throw error;
  }
  }

  async searchByexamName(examName: string,teacherId: string){
    try {
      const response = await this.client.search({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        body: {
            query: {
              bool: {
                must: [
                  {
                    query_string: {
                      query: `title:*${examName}*`
              }
                  },
                  {
                    match: {
                      teacherId: teacherId
                    }
                  }
                ]
              }
            }
        }
    });
    const result = []
    for(const exam of response.hits.hits){
      if (typeof exam._source === 'object' && exam._source !== null &&'title' in exam._source) {
        result.push(
          {
            // examId: exam._source.examId,
            title: exam._source.title,
            // courseName: exam._source.courseName,
          })
      }
    }
    return result
  } catch (error) {
      // Handle error
      console.error('Error', error);
      throw error;
  }
  }

  async update(id,doc){
    return await this.client.update({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        id: id,
        doc: doc
      })
  }

  async deleteDocumentByCourseID(courseID: string): Promise<any> {
    try {
      const response = await this.client.deleteByQuery({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        body: {
          query: {
            match: {
              courseId: courseID
            }
          }
        }
      });
      return response;
    } catch (error) {
      // Handle error
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async deleteDocumentByExamID(examID: string): Promise<any> {
    try {
      const response = await this.client.deleteByQuery({
        index: process.env.ELASTIC_SEARCH_CLOUD_INDEX,
        body: {
          query: {
            match: {
              examId: examID
            }
          }
        }
      });
      return response;
    } catch (error) {
      // Handle error
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  async deleteIndex(){
    return await this.client.indices.delete({ index: 'my_index' })
  }

  // Add other methods as needed
}
