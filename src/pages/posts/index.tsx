import Head from "next/head";
import styles from "./styles.module.scss";

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="#">
                        <time>12 de março de 2023</time>
                        <strong>Creating a Monorepo with Learn & Yarn Workspace</strong>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                            mollitia repudiandae modi nostrum recusandae omnis, esse
                            blanditiis facilis sed delectus quod assumenda suscipit rerum amet
                            quia. Labore atque excepturi at!
                        </p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2023</time>
                        <strong>Creating a Monorepo with Learn & Yarn Workspace</strong>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                            mollitia repudiandae modi nostrum recusandae omnis, esse
                            blanditiis facilis sed delectus quod assumenda suscipit rerum amet
                            quia. Labore atque excepturi at!
                        </p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2023</time>
                        <strong>Creating a Monorepo with Learn & Yarn Workspace</strong>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                            mollitia repudiandae modi nostrum recusandae omnis, esse
                            blanditiis facilis sed delectus quod assumenda suscipit rerum amet
                            quia. Labore atque excepturi at!
                        </p>
                    </a>
                </div>
            </main>
        </>
    );
}
