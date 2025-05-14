import React from "react";
import styles from "../assets/posts.module.css";
import { posts } from "../data/postsData";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Comunity = () => {
  return (
    <section className={styles.catalogo}>
      <div className={styles.header}>
        <h2 className={styles.title}>Comunidade</h2>
        <Link to="/Publish" className={styles.btn}>
        Criar Postagem<i className="bi bi-plus-circle"></i>
        </Link>
      </div>
      
      <div className={styles.cardsContainer}>
        {Object.entries(posts).map(([key, post]) => (
          <div key={key} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <img src={post.ownerImage} className={styles.ownerImage} />
                <h3 className={styles.cardTitle}>{post.postOwner}</h3>
              </div>
              <div className={styles.postContent}>
                <span>{post.content}</span>
              </div>
              <p className={styles.cardMeta}>Enviado em {post.date}</p>
              {post.image ? <img
                src={post.image}
                alt={post.title}
                className={styles.cardImg}
              /> : null}
              <div className={styles.cardActions}>
                <button className={styles.icon}>
                  <i className="bi bi-hand-thumbs-up-fill"></i>
                  <p>{post.likes}</p>
                </button>
                <a className={styles.icon} href="#comment">
                  <i className="bi bi-chat-fill"></i>
                  <p>{post.commentCount}</p>
                </a>
              </div>
            </div>
            <div className={styles.commentSection}>
              <form className={styles.commentForm}>
                <input type="text" placeholder="Escreva um comentário..." />
                <button type="submit">Comentar</button>
              </form>
              {post.comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <img
                      src={comment.image}
                      alt=""
                      className={styles.ownerImage}
                    />
                    <p>{comment.owner}</p>
                  </div>
                  <div className={styles.commentContent}>
                    <p className={styles.text}>{comment.content}</p>
                    <p className={styles.date}>{comment.date}</p>
                  </div>
                  <div className={styles.commentActions}>
                    <button className={styles.icon}>
                      <i className="bi bi-hand-thumbs-up-fill" />
                      <p>{comment.likes}</p>
                    </button>
                    <button className={styles.icon}>
                      <i className="bi bi-chat-fill" />
                      <p>{comment.replyCount}</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Comunity;
